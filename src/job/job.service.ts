import { Injectable } from '@nestjs/common';
import { Job } from './models/Job';
import { spawn, ChildProcess } from 'child_process';
import { v4 as uuid } from 'uuid';
import { FileService } from '../file';
import { STATUS } from './models/Status.enum';

@Injectable()
export class JobService {
	// Contains all jobs
	jobs: Job[] = [];

	constructor(private fileSvc: FileService) {}

	/**
	 * Starts a new job
	 *
	 * @param job Job to be started
	 * @returns Array containing the child process spawned, and the job itself
	 */
	startNew(job: Job): Job {
		job.id = uuid();

		job.directory = process.env.JTR_ROOT + 'jobs/' + job.id + '/';
		const passwdFile = job.directory + 'passwd.txt';
		this.fileSvc.copy(job.file, passwdFile);

		job.child = spawn(process.env.JTR_EXECUTABLE, [
			passwdFile,
			'--format=' + (job.format || 'nt'),
			'--wordlist=' + (job.wordlist || process.env.JTR_ROOT + 'wordlist.txt'),
		]);

		job.status = STATUS.STARTED;

		this.jobs.push(job);
		return job;
	}

	/**
	 * Starts given listeners
	 *
	 * @param job Job to listen on
	 */
	startListeners(job: Job): void {
		job.child.stdout.on('data', data => {
			this.fileSvc.write(job.directory + 'stdout.txt', data.toString());
		});

		job.child.stderr.on('data', data => {
			this.fileSvc.write(job.directory + 'stderr.txt', data.toString());
		});

		job.child.on('exit', () => {
			job.status = STATUS.FINISHED;
		});
	}
}
