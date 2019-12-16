import { Injectable } from '@nestjs/common';
import { FileService } from '../file';

@Injectable()
export class RulesService {
	constructor(private fileSvc: FileService) {}

	/**
	 * Gets all rules
	 */
	async getAll(): Promise<string[]> {
		const conf = await this.fileSvc.read(process.env.JTR_EXECUTABLE + '.conf');
		return conf
			.toString()
			.split('\n')
			.filter(l => l.startsWith('[List.Rules'))
			.map(r => r.split(':')[1].split(']')[0]);
	}
}
