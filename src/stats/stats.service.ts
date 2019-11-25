import { Injectable } from '@nestjs/common';
import { JobService } from '../job';
import { FileService } from '../file';

@Injectable()
export class StatsService {
	constructor(private jobSvc: JobService, private fileSvc: FileService) {}

	/**
	 * Gets amount of admins cracked
	 *
	 * @param _id Id of Job to get stats on
	 * @param potFile Optional pot file to use
	 */
	async getAdminsCracked(
		// tslint:disable-next-line: variable-name
		_id: string,
		potFile: string = process.env.JTR_ROOT + 'JohnTheRipper/run/john.pot',
	): Promise<{
		total: number;
		cracked: number;
		percentage: number;
	}> {
		let total = 0;
		let cracked = 0;
		const potParsed = new Map<string, string>();

		const job = await this.jobSvc.getJob(_id);
		const [passwd, pot] = await Promise.all([
			this.fileSvc.read(job.directory + 'passwd.txt'),
			this.fileSvc.read(potFile),
		]);

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

		// Adds hashes to Map
		pot
			.toString()
			.trim()
			.split('\n')
			.map(p => {
				const split = p.split(':');
				potParsed.set(split[0].substr(4).toLowerCase(), split[1].toLowerCase());
			});

		passwdParsed.forEach(pass => {
			total++;
			if (potParsed.get(pass.toLowerCase())) cracked++;
		});

		const percentage = Math.round(100 - ((total - cracked) / total) * 100);
		return { total, cracked, percentage };
	}
}
