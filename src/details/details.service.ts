import { Injectable } from '@nestjs/common';
import { DocumentQuery, Model } from 'mongoose';
import { Job } from '../job';

@Injectable()
export class DetailsService {
	model: Model<Job>;

	getJobs() {
		return this.model.find({});
	}
}
