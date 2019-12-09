import { Controller, Get, Param, Res, Header, Query } from '@nestjs/common';
import { StatsService } from './stats.service';
import { stringify } from 'querystring';

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
	async passwdHash(@Query('password') password, @Param('id') id) {
		return { count: await this.statsSvc.getFreqCount(id, password) };
	}
}
