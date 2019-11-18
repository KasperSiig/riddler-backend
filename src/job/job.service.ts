import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ChildProcess, spawn } from 'child_process';
import { Model, Query, Types } from 'mongoose';
import { FileService } from '../file';
import { STATUS } from './enums/status.enum';
import { Job } from './interfaces/job.interface';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable()
export class JobService {
	children: Map<string, ChildProcess> = new Map();

	constructor(
		private fileSvc: FileService,
		@InjectModel('Job') public readonly model: Model<Job>,
	) {}

	/**
	 * Starts a new job
	 *
	 * @param job Job to be started
	 * @returns Array containing the child process spawned, and the job itself
	 */
	async startNew(job: Job): Promise<ChildProcess> {
		job.format = job.format || 'nt';
		job.wordlist = job.wordlist || process.env.JTR_ROOT + 'wordlist.txt';
		const jobSaved = await this.create(job);
		const passwdFile = jobSaved.directory + 'passwd.txt';
		await this.fileSvc.copy(jobSaved.file, passwdFile);

		const child = spawn(process.env.JTR_EXECUTABLE, [
			passwdFile,
			'--format=' + jobSaved.format,
			'--wordlist=' + jobSaved.wordlist,
		]);

		this.startListeners(jobSaved, child);

		jobSaved.status = STATUS.STARTED;
		this.update(jobSaved).then(() => {});
		return child;
	}

	/**
	 * Starts given listeners
	 *
	 * @param job Job to listen on
	 */
	startListeners(job: Job, child: ChildProcess): void {
		child.stdout.on('data', data => {
			this.fileSvc.write(job.directory + 'stdout.txt', data.toString());
		});

		child.stderr.on('data', data => {
			this.fileSvc.write(job.directory + 'stderr.txt', data.toString());
		});

		child.on('exit', () => {
			job.status = STATUS.FINISHED;
			this.update(job).then(() => {});
		});
		this.children.set(job._id, child);
	}

	/**
	 * Updates a current job in the database
	 *
	 * @param job Job to be saved
	 */
	update(job: Job): Query<Job> {
		return this.model.findOneAndUpdate({ _id: job._id }, job, {
			new: true,
		});
	}

	/**
	 * Saves a job in the database
	 *
	 * @param job Job to be created
	 */
	create(job: Job): Promise<Job> {
		job._id = new Types.ObjectId().toString();
		job.directory = process.env.JTR_ROOT + 'jobs/' + job._id + '/';
		return this.model.create(job);
	}

	/**
	 * Gets all jobs
	 */
	getAll() {
		return this.model.find({});
	}

	/**
	 * Gets jobs via Id
	 * @param id ID to find job by
	 */
	getJob(id: string) {
		return this.model.findById(id);
	}
}
