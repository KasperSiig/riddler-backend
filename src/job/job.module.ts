import { JobSchema } from './schemas/job.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import { FileModule } from '../file';

@Module({
	imports: [
		FileModule,
		MongooseModule.forFeature([{ name: 'Job', schema: JobSchema }]),
	],
	controllers: [JobController],
	providers: [JobService],
})
export class JobModule {}
