import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileModule } from '../file';
import { WordlistModule } from '../wordlist';
import { HelperService } from './helper.service';
import { JobDataService } from './job-data.service';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import { JobSchema } from './schemas/job.schema';

@Module({
	imports: [
		FileModule,
		MongooseModule.forFeature([{ name: 'Job', schema: JobSchema }]),
		WordlistModule,
	],
	controllers: [JobController],
	providers: [JobService, HelperService, JobDataService],
	exports: [JobService, JobDataService],
})
export class JobModule {}
