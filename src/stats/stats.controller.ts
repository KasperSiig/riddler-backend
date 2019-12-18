import { Controller, Get, Param, Query } from '@nestjs/common';
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

	/**
	 * Returns stats in a comma seperated string
	 */
	@Get(':id/export')
	async exportStats(@Param('id') id) {
		return { stats: await this.statsSvc.exportStats(id) };
	}

	/**
	 * Returns frequency of a specific password
	 *
	 * @param password Password to check frequency on
	 * @param id Id of job to get frequency on
	 */
	@Get(':id/frequency')
	async getFreq(@Query('password') password, @Param('id') id) {
		return { count: await this.statsSvc.getFreqCount(id, password) };
	}

	/**
	 * Gets top ten most used passwords of a given job
	 *
	 * @param id Id of job to get stats from
	 */
	@Get(':id/topten')
	getTopTenStats(@Param('id') id: string) {
		return this.statsSvc.getTopTenStats(id);
	}
}
