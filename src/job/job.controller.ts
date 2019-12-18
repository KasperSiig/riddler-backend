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
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentQuery } from 'mongoose';
import { STATUS } from './enums/status.enum';
import { Job } from './interfaces/job.interface';
import { JobDataService } from './job-data.service';
import { JobService } from './job.service';

@Controller('jobs')
export class JobController {
	constructor(private jobSvc: JobService, private dataSvc: JobDataService) {}

	/**
	 * Starts a new job
	 *
	 * @param job Job to be started
	 */
	@Post('')
	@UseInterceptors(FileInterceptor('file'))
	async startNew(@Body() body: any, @UploadedFile() file): Promise<void> {
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
	getJobs(): DocumentQuery<Job[], Job, {}> {
		return this.dataSvc.getAll();
	}

	/**
	 * Gets a job via Id
	 * @param id
	 */
	@Get(':id')
	getOne(@Param('id') id: string): DocumentQuery<Job, Job, {}> {
		return this.dataSvc.getOne(id);
	}

	/**
	 * Finds job by a given status
	 *
	 * @param status Status to find Job by
	 */
	@Get('')
	getByStatus(@Query('status') status: STATUS): DocumentQuery<Job[], Job, {}> {
		return this.dataSvc.getManyByStatus(status);
	}
}
