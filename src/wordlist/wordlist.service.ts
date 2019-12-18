import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { FileService } from '../file';
import { HelperService } from './helper.service';
import { Wordlist } from './interfaces/wordlist.interface';
import { WordlistDataService } from './wordlist-data.service';

@Injectable()
export class WordlistService {
	constructor(
		private fileSvc: FileService,
		private dataSvc: WordlistDataService,
		private helper: HelperService,
	) {}

	/**
	 * Creates a wordlist
	 *
	 * @param wordlist Wordlist to create
	 * @param file File to create Wordlist from
	 */
	async create(wordlist: Wordlist, file: any): Promise<Wordlist> {
		wordlist._id = new Types.ObjectId().toString();
		wordlist.path = process.env.JTR_ROOT + 'wordlist/' + wordlist._id + '.txt';

		await this.helper.validateWordlist(wordlist, file);

		this.fileSvc.mkdirSync(process.env.JTR_ROOT + 'wordlist/');
		await this.fileSvc.append(wordlist.path, file.buffer.toString());
		return this.dataSvc.findOneAndUpdate(wordlist).exec();
	}

	/**
	 * Gets default wordlist
	 */
	async getDefault(): Promise<Wordlist> {
		const arr = await this.dataSvc.getAll().exec();
		return arr[0];
	}
}
