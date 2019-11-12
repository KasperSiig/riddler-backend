import { Injectable } from '@nestjs/common';
import { Job } from './models/Job';
import { spawn } from 'child_process';

@Injectable()
export class JobService {
	/**
	 * Starts a new job
	 *
	 * @param job Job to be started
	 */
	startNew(job: Job): void {
		spawn(process.env.JTR_EXECUTABLE, [
			job.file,
			'--format=' + (job.format || 'nt'),
			'--wordlist=' + (job.wordlist || '/opt/jtr/wordlist.txt'),
		]);
	}
}
