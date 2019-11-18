import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { JobService } from './job.service';
import { Job } from './interfaces/job.interface';

@Controller('job')
export class JobController {
	getByStatus(FINISHED: import('.').STATUS) {
		throw new Error('Method not implemented.');
	}
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

	/**
	 * Gets all jobs
	 */
	@Get('')
	getJobs() {
		return this.jobSvc.getAll();
	}

	/**
	 * Gets a job via Id
	 * @param id
	 */
	@Get(':id')
	get(@Param('id') id: string) {
		return this.jobSvc.getJob(id);
	}
}
