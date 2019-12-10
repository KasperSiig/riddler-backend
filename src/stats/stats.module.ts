import { Module } from '@nestjs/common';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { JobModule } from '../job';
import { FileModule } from '../file';
import { HelperService } from './helper.service';

@Module({
	controllers: [StatsController],
	providers: [StatsService, HelperService],
	imports: [JobModule, FileModule],
})
export class StatsModule {}
