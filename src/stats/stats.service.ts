import { Injectable } from '@nestjs/common';
import { FileService } from '../file';
import { JobDataService } from '../job';
import { HelperService } from './helper.service';

@Injectable()
export class StatsService {
	constructor(
		private jobDataSvc: JobDataService,
		private fileSvc: FileService,
		private helper: HelperService,
	) {}

	/**
	 * Gets amount of admins cracked
	 *
	 * @param id Id of Job to get stats on
	 * @param potFile Optional pot file to use
	 */
	async getAdminsCracked(
		id: string,
		potFile: string = process.env.JTR_ROOT + 'JohnTheRipper/run/john.pot',
	): Promise<{ total: number; cracked: number; percentage: number }> {
		return this.getPercentageCracked(
			id,
			potFile,
			this.helper.getFilter('admins'),
		);
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
		return this.getPercentageCracked(id, potFile);
	}

	/**
	 * Gets percentage of users cracked
	 *
	 * @param hashes Hashes to run stats on
	 * @param potFile Potfile to use
	 * @param filter Filter users based on the given lambda. By default chooses all
	 */
	async getPercentageCracked(
		id: string,
		potFile: string,
		filter = (p: any) => p,
	): Promise<{
		total: number;
		cracked: number;
		percentage: number;
	}> {
		const job = await this.jobDataSvc.getOne(id);

		const hashes = this.helper.parsePasswd(
			await this.fileSvc.read(job.directory + 'passwd.txt'),
			filter,
		);
		const potParsed = this.helper.parsePot(await this.fileSvc.read(potFile));

		const total = hashes.length;
		const cracked = hashes.filter(p => !!potParsed.get(p.toLowerCase())).length;
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
		let stats = 'Name,Total,Cracked,Percentage,Top 10\n';
		const [admins, adminsTop10, all, allTop10] = await Promise.all([
			this.getAdminsCracked(jobId, potFile),
			this.getTopTenStats(jobId, this.helper.getFilter('admins')),
			this.getAllCracked(jobId, potFile),
			this.getTopTenStats(jobId),
		]);
		const mapTop10 = arr => arr.map(p => p.password + ':' + p.count).join(';');
		stats +=
			'Admins,' +
			Object.values(admins).join(',') +
			',' +
			mapTop10(adminsTop10) +
			'\n';
		stats +=
			'All,' + Object.values(all).join(',') + ',' + mapTop10(allTop10) + '\n';
		return stats;
	}

	/**
	 * Getting the hash of the password received
	 *
	 * @param password Password received
	 * @param potFile Optional pot file to use
	 */
	async getpasswdHash(password: string, potFile: string): Promise<string> {
		return this.helper
			.parsePot(await this.fileSvc.read(potFile), false)
			.get(password);
	}

	/**
	 * Return frequency on password
	 *
	 * @param id Id of job
	 * @param password Password to check frequency on
	 * @param potFile Optional pot file to use
	 */
	async getFreqCount(
		id: string,
		password: string,
		potFile: string = process.env.JTR_ROOT + 'JohnTheRipper/run/john.pot',
	) {
		const job = await this.jobDataSvc.getOne(id);
		const passwdHash = await this.getpasswdHash(password, potFile);
		const passwdParsed = this.helper.parsePasswd(
			await this.fileSvc.read(job.directory + 'passwd.txt'),
		);

		const count = passwdParsed.filter(p => p.toLowerCase() === passwdHash)
			.length;
		return count;
	}

	/**
	 * Get top 10 most used passwords
	 *
	 * @param id Id of job to get stats by
	 * @param filter Arrow function to filter users on
	 * @param potFile Optional potfile to use
	 */
	async getTopTenStats(
		id: string,
		filter = (p: any) => p,
		potFile: string = process.env.JTR_ROOT + 'JohnTheRipper/run/john.pot',
	) {
		const job = await this.jobDataSvc.getOne(id);
		const passwdParsed = this.helper.parsePasswd(
			await this.fileSvc.read(job.directory + 'passwd.txt'),
			filter,
		);
		const potParsed = this.helper.parsePot(
			await this.fileSvc.read(potFile),
			false,
		);
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
