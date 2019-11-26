import { Controller, Get, Param } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {
	constructor(private statsSvc: StatsService) {}

	/**
	 * Returns how many admins are cracked
	 *
	 * @param id Id of job to get stats on
	 */
	@Get(':id/admins')
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

	/**
	 * Returns how many users are cracked
	 *
	 * @param id Id of job to get stats on
	 */
	@Get(':id/all')
	getAllCracked(
		@Param('id') id: string,
	): Promise<{
		total: number;
		cracked: number;
		percentage: number;
	}> {
		return this.statsSvc.getAllCracked(id);
	}
}
