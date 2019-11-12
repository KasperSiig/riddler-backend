import { Injectable } from '@nestjs/common';
import { Job } from './models/Job';

@Injectable()
export class JobService {
	// TODO: Implement function
	startNew(job: Job): string {
		return 'hello';
	}
}
