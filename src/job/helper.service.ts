import { BadRequestException, Injectable } from '@nestjs/common';
import { FileService } from '../file';
import { Job } from './interfaces/job.interface';
import { JobDataService } from './job-data.service';

@Injectable()
export class HelperService {
	validFormats = ['nt'];

	constructor(private fileSvc: FileService, private dataSvc: JobDataService) {}

	/**
	 * Validates a given job
	 *
	 * @param job Job to validate
	 * @param file File associated with Job
	 */
	async validateJob(job: Job, file: any): Promise<void> {
		if (!job.name) throw new BadRequestException('Name required', job.name);
		if (await this.dataSvc.getOneByName(job.name))
			throw new BadRequestException(
				'Job with that name already exists',
				job.name,
			);
		if (!job.wordlist.path.match(/^[a-zA-Z0-9\/\.]+$/))
			throw new BadRequestException('Wordlist not valid', job.wordlist.path);
		if (!this.validFormats.includes(job.format))
			throw new BadRequestException('Format not valid', job.format);
		this.fileSvc.validateOne(job.wordlist.path);
		if (!file) throw new BadRequestException('No file chosen', file);
	}
}
