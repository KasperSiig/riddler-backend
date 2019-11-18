import { Controller, Get } from '@nestjs/common';
import { Job } from '../job';
import { DetailsService } from './details.service';
import { DocumentQuery } from 'mongoose';

@Controller('details')
export class DetailsController {
	constructor(private detailSvc: DetailsService) {}

	@Get('')
	getJobs() {
		return this.detailSvc.getJobs();
	}
}
