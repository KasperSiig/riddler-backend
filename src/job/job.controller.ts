import {
	Controller,
	Post,
	Body,
	Get,
	Param,
	Query,
	HttpException,
	HttpStatus,
} from '@nestjs/common';
import { JobService } from './job.service';
import { Job } from './interfaces/job.interface';
import { STATUS } from './enums/status.enum';
import { DocumentQuery } from 'mongoose';
import { JobDTO } from './dto/job.dto';

@Controller('jobs')
export class JobController {
	constructor(private jobSvc: JobService) {}

	/**
	 * Starts a new job
	 *
	 * @param job Job to be started
	 */
	@Post('new')
	async startNew(@Body() job: JobDTO): Promise<void> {
		try {
			await this.jobSvc.startNew(job as Job);
		} catch (error) {
			throw new HttpException('', HttpStatus.ACCEPTED);
		}
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

	/**
	 * Finds job by a given status
	 *
	 * @param status Status to find Job by
	 */
	@Get('')
	getByStatus(@Query('status') status: STATUS): DocumentQuery<Job[], Job, {}> {
		return this.jobSvc.getByStatus(status);
	}
}
