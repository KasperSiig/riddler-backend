import { Module } from '@nestjs/common';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import { FileModule } from '../file';

@Module({
	imports: [FileModule],
	controllers: [JobController],
	providers: [JobService],
})
export class JobModule {}
