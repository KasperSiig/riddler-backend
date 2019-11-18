import { Controller, Post, Body, Get } from '@nestjs/common';
import { JobService } from './job.service';
import { Job } from './interfaces/job.interface';

@Controller('job')
export class JobController {
	constructor(private jobSvc: JobService) {}

	/**
	 * Starts a new job
	 *
	 * @param job Job to be started
	 */
	@Post('new')
	startNew(@Body() job: Job): void {
		this.jobSvc.startNew(job);
	}

	@Get('')
	getJobs() {
		return this.jobSvc.getAll();
	}
}
