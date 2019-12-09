import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	Query,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { DocumentQuery } from 'mongoose';
import { JobDTO } from './dto/job.dto';
import { STATUS } from './enums/status.enum';
import { Job } from './interfaces/job.interface';
import { JobService } from './job.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('jobs')
export class JobController {
	constructor(private jobSvc: JobService) {}

	/**
	 * Starts a new job
	 *
	 * @param job Job to be started
	 */
	@Post('new')
	@UseInterceptors(FileInterceptor('file'))
	async startNew(@Body() body: any, @UploadedFile() file) {
		try {
			await this.jobSvc.startNew(JSON.parse(body.job) as Job, file);
		} catch (err) {
			throw err;
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
