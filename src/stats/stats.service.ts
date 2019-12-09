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
		if (pot.toString() === '')
			return { total: hashes.length, cracked: 0, percentage: 0 };
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

	/**
	 * Returns stats in a comma seperated string
	 */
	async exportStats(
		jobId: string,
		potFile: string = process.env.JTR_ROOT + 'JohnTheRipper/run/john.pot',
	) {
		let stats = 'Name,Total,Cracked,Percentage\n';
		const admins = await this.getAdminsCracked(jobId, potFile);
		const all = await this.getAllCracked(jobId, potFile);
		stats += 'Admins,' + Object.values(admins).join(',') + '\n';
		stats += 'All,' + Object.values(all).join(',') + '\n';
		return stats;
	}

	/**
	 * Getting the hash of the password received
	 *
	 * @param password Password received
	 * @param potFile Optional pot file to use
	 */
	async getpasswdHash(password: string, potFile: string): Promise<string> {
		const potParsed = new Map<string, string>();

		const pot = await this.fileSvc.read(potFile);
		pot
			.toString()
			.trim()
			.split('\n')
			.map(p => {
				const split = p.split(':');
				potParsed.set(split[1], split[0].substr(4).toLowerCase());
			});
		return potParsed.get(password);
	}

	/**
	 * Return frequency on password
	 *
	 * @param id Id of job
	 * @param password Password to check frequency on
	 */
	async getFreqCount(
		id: string,
		password: string,
		potFile: string = process.env.JTR_ROOT + 'JohnTheRipper/run/john.pot',
	) {
		const job = await this.jobSvc.getJob(id);
		const passwdHash = await this.getpasswdHash(password, potFile);
		const passwd = await this.fileSvc.read(job.directory + 'passwd.txt');
		let count = 0;

		const passwdParsed = passwd
			.toString()
			.trim()
			.split('\n')
			.map(p => {
				return p.split(':')[3];
			});
		passwdParsed.forEach(pass => {
			if (pass.toLowerCase() === passwdHash) count++;
		});
		return count;
	}

	/**
	 * Get top 10 most used passwords
	 *
	 * @param id Id of job to get stats by
	 * @param potFile Optional potfile to use
	 */
	async getTopTenStats(
		id: string,
		potFile: string = process.env.JTR_ROOT + 'JohnTheRipper/run/john.pot',
	) {
		const job = await this.jobSvc.getJob(id);
		const passwd = await this.fileSvc.read(job.directory + 'passwd.txt');
		const potParsed = new Map<string, string>();

		const passwdParsed = passwd
			.toString()
			.trim()
			.split('\n')
			.map(p => {
				return p.split(':')[3];
			});

		const pot = await this.fileSvc.read(potFile);
		pot
			.toString()
			.trim()
			.split('\n')
			.map(p => {
				const split = p.split(':');
				potParsed.set(split[1], split[0].substr(4).toLowerCase());
			});
		const passwdWithCount = [...potParsed.keys()].map(k => {
			return {
				password: k,
				count: passwdParsed.filter(p => p.toLowerCase() === potParsed.get(k))
					.length,
			};
		});

		return passwdWithCount.sort((p1, p2) => p2.count - p1.count).slice(0, 9);
	}
}
