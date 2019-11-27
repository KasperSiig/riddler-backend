import { Injectable } from '@nestjs/common';
import { FileService } from '../file';
import { JobService } from '../job';

@Injectable()
export class StatsService {
	constructor(private jobSvc: JobService, private fileSvc: FileService) {}

	/**
	 * Gets amount of admins cracked
	 *
	 * @param id Id of Job to get stats on
	 * @param potFile Optional pot file to use
	 */
	async getAdminsCracked(
		// tslint:disable-next-line: variable-name
		id: string,
		potFile: string = process.env.JTR_ROOT + 'JohnTheRipper/run/john.pot',
	): Promise<{ total: number; cracked: number; percentage: number }> {
		const job = await this.jobSvc.getJob(id);
		const passwd = await this.fileSvc.read(job.directory + 'passwd.txt');

		const passwdParsed = passwd
			.toString()
			.trim()
			.split('\n')
			.filter(p => {
				const split = p.split(',');
				if (split[split.length - 3].toLowerCase().endsWith('true')) return true;
				return false;
			})
			.map(p => {
				return p.split(':')[3];
			});
		return this.getPercentageCracked(passwdParsed, potFile);
	}

	/**
	 * Gets amount of users cracked
	 *
	 * @param id Id of Job to get stats on
	 * @param potFile Optional pot file to use
	 */
	async getAllCracked(
		id: string,
		potFile: string = process.env.JTR_ROOT + 'JohnTheRipper/run/john.pot',
	): Promise<{ total: number; cracked: number; percentage: number }> {
		const job = await this.jobSvc.getJob(id);
		const passwd = await this.fileSvc.read(job.directory + 'passwd.txt');

		const passwdParsed = passwd
			.toString()
			.trim()
			.split('\n')
			.map(p => {
				return p.split(':')[3];
			});
		return this.getPercentageCracked(passwdParsed, potFile);
	}

	/**
	 * Gets percentage of users cracked
	 *
	 * @param hashes Hashes to run stats on
	 * @param potFile Potfile to use
	 */
	async getPercentageCracked(
		hashes: string[],
		potFile: string,
	): Promise<{
		total: number;
		cracked: number;
		percentage: number;
	}> {
		const potParsed = new Map<string, string>();
		let total = 0;
		let cracked = 0;

		const pot = await this.fileSvc.read(potFile);
		pot
			.toString()
			.trim()
			.split('\n')
			.map(p => {
				const split = p.split(':');
				potParsed.set(split[0].substr(4).toLowerCase(), split[1].toLowerCase());
			});

		hashes.forEach(pass => {
			total++;
			if (potParsed.get(pass.toLowerCase())) cracked++;
		});
		const percentage = Math.round(100 - ((total - cracked) / total) * 100);
		return { total, cracked, percentage };
	}
}