import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DocumentQuery, Model, Query } from 'mongoose';
import { STATUS } from './enums/status.enum';
import { Job } from './interfaces/job.interface';

@Injectable()
export class JobDataService {
	constructor(@InjectModel('Job') public readonly model: Model<Job>) {}

	/**
	 * Gets all jobs
	 */
	getAll() {
		return this.model.find({});
	}

	/**
	 * Gets jobs via Id
	 * @param id ID to find job by
	 */
	getOne(id: string) {
		return this.model.findById(id);
	}

	/**
	 * Finds job by a given status
	 *
	 * @param status Status to find Job by
	 */
	getManyByStatus(status: STATUS): DocumentQuery<Job[], Job, {}> {
		return this.model.find({ status });
	}

	/**
	 * Finds job by a given name
	 *
	 * @param name Name to find Job by
	 */
	getOneByName(name: string) {
		return this.model.findOne({ name });
	}

	/**
	 * Updates a current job in the database
	 *
	 * @param job Job to be saved
	 */
	updateOne(job: Job): Query<Job> {
		return this.model.findOneAndUpdate({ _id: job._id }, job, {
			new: true,
		});
	}

	/**
	 * Updates a given Job and return the updated object
	 *
	 * @param job Job to update
	 */
	findOneAndUpdate(job: Job): DocumentQuery<Job, Job, {}> {
		return this.model.findOneAndUpdate({ _id: job._id }, job, {
			upsert: true,
			new: true,
		});
	}
}
