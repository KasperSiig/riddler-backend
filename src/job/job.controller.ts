import { Controller, Post, Body } from '@nestjs/common';
import { JobService } from './job.service';
import { Job } from './models/Job';

@Controller('job')
export class JobController {
	constructor(private jobSvc: JobService) {}

	@Post('new')
	startNew(@Body() job: Job): string {
		return this.jobSvc.startNew(job);
	}
}
