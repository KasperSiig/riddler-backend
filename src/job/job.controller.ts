import { Controller, Post, Body } from '@nestjs/common';
import { JobService } from './job.service';
import { Job } from './models/Job';

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
		const res = this.jobSvc.startNew(job);
		this.jobSvc.startListeners(...res);
	}
}
