import { Module } from '@nestjs/common';
import { FileModule } from '../file';
import { JobModule } from '../job';
import { HelperService } from './helper.service';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';

@Module({
	controllers: [StatsController],
	providers: [StatsService, HelperService],
	imports: [JobModule, FileModule],
})
export class StatsModule {}
