import { JobSchema } from './schemas/job.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import { FileModule } from '../file';
import { WordlistModule } from '../wordlist';

@Module({
	imports: [
		FileModule,
		MongooseModule.forFeature([{ name: 'Job', schema: JobSchema }]),
		WordlistModule,
	],
	controllers: [JobController],
	providers: [JobService],
	exports: [JobService],
})
export class JobModule {}
