import { Injectable } from '@nestjs/common';
import { ChildProcess, spawn } from 'child_process';
import { Types } from 'mongoose';
import { FileService } from '../file';
import { WordlistService } from '../wordlist';
import { STATUS } from './enums/status.enum';
import { HelperService } from './helper.service';
import { Job } from './interfaces/job.interface';
import { JobDataService } from './job-data.service';

@Injectable()
export class JobService {
	children: Map<string, ChildProcess> = new Map();

	constructor(
		private fileSvc: FileService,
		private wordlistSvc: WordlistService,
		private helper: HelperService,
		private dataSvc: JobDataService,
	) {}

	/**
	 * Starts a new job
	 *
	 * @param job Job to be started
	 * @param file File containing passwords
	 * @returns Array containing the child process spawned, and the job itself
	 */
	async startNew(job: Job, file: any): Promise<ChildProcess> {
		job.format = job.format || 'nt';
		job.wordlist = job.wordlist || (await this.wordlistSvc.getDefault());
		job.time = Date.now();
		job.rule = job.rule || 'None';

		await this.helper.validateJob(job, file);

		const jobSaved = await this.create(job);
		const passwdFile = jobSaved.directory + 'passwd.txt';
		this.fileSvc.mkdirSync(jobSaved.directory);
		await this.fileSvc.append(passwdFile, file.buffer.toString());

		const command = [
			passwdFile,
			'--format=' + jobSaved.format,
			'--wordlist=' + jobSaved.wordlist.path,
			'--rules=' + job.rule,
		];
		const child = spawn(process.env.JTR_EXECUTABLE, command);

		this.startListeners(jobSaved, child);

		jobSaved.status = STATUS.STARTED;
		this.dataSvc.updateOne(jobSaved).then(() => {});
		return child;
	}

	/**
	 * Starts given listeners
	 *
	 * @param job Job to listen on
	 * @param child ChildProcess to listen on
	 */
	startListeners(job: Job, child: ChildProcess): void {
		child.stdout.on('data', data => {
			this.fileSvc.append(job.directory + 'stdout.txt', data.toString());
		});

		child.stderr.on('data', data => {
			this.fileSvc.append(job.directory + 'stderr.txt', data.toString());
		});

		child.on('exit', () => {
			job.status = STATUS.FINISHED;
			this.dataSvc.updateOne(job).then(() => {});
		});

		this.children.set(job._id, child);
	}

	/**
	 * Saves a job in the database
	 *
	 * @param job Job to be created
	 */
	create(job: Job): Promise<Job> {
		job._id = new Types.ObjectId().toString();
		job.directory = process.env.JTR_ROOT + 'jobs/' + job._id + '/';
		return this.dataSvc.findOneAndUpdate(job).exec();
	}
}
