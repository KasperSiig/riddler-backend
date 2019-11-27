import { Module } from '@nestjs/common';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { JobModule } from '../job';
import { FileModule } from '../file';

@Module({
	controllers: [StatsController],
	providers: [StatsService],
	imports: [JobModule, FileModule],
})
export class StatsModule {}