import { Injectable } from '@nestjs/common';
import { Job } from './models/Job';
import { spawn, ChildProcess } from 'child_process';
import { v4 as uuid } from 'uuid';
import { FileService } from '../file';

@Injectable()
export class JobService {
	// Contains all jobs
	jobs: any[] = [];

	constructor(private fileSvc: FileService) {}

	/**
	 * Starts a new job
	 *
	 * @param job Job to be started
	 * @returns Array containing the child process spawned, and the job itself
	 */
	startNew(job: Job): [ChildProcess, Job] {
		// TODO: Implement uniqueness checking
		job.id = uuid();

		job.directory = process.env.JTR_ROOT + 'jobs/' + job.id + '/';
		const passwdFile = job.directory + 'passwd.txt';
		this.fileSvc.copy(job.file, passwdFile);

		const jobSpawned = spawn(process.env.JTR_EXECUTABLE, [
			passwdFile,
			'--format=' + (job.format || 'nt'),
			'--wordlist=' + (job.wordlist || process.env.JTR_ROOT + 'wordlist.txt'),
		]);

		this.jobs.push(jobSpawned);
		return [jobSpawned, job];
	}

	/**
	 * Starts given listeners
	 *
	 * @param process Process to listen on
	 * @param job Job to listen on
	 */
	startListeners(process: ChildProcess, job: Job): void {
		process.stdout.on('data', data => {
			this.fileSvc.write(job.directory + 'stdout.txt', data.toString());
		});

		process.stderr.on('data', data => {
			this.fileSvc.write(job.directory + 'stderr.txt', data.toString());
		});
	}
}
