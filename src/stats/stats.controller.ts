import { Controller, Get, Query, Param } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {
	constructor(private statsSvc: StatsService) {}

	@Get(':id')
	getAdminsCracked(
		// tslint:disable-next-line: variable-name
		@Param('id') id: string,
	): Promise<{
		total: number;
		cracked: number;
		percentage: number;
	}> {
		return this.statsSvc.getAdminsCracked(id);
	}
}
