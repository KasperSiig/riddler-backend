import { Injectable } from '@nestjs/common';
import { Wordlist } from './interfaces/wordlist.interface';
import { Types, Model, DocumentQuery } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class WordlistService {
	constructor(
		@InjectModel('Wordlist') public readonly model: Model<Wordlist>,
	) {}

	/**
	 * Gets all wordlists saved in database
	 */
	getAll(): DocumentQuery<Wordlist[], Wordlist, {}> {
		return this.model.find({});
	}

	/**
	 * Creates a wordlist
	 *
	 * @param wordlist Wordlist to create
	 */
	create(wordlist: Wordlist): Promise<Wordlist> {
		wordlist._id = new Types.ObjectId().toString();
		return this.model
			.findOneAndUpdate({ _id: wordlist._id }, wordlist, {
				upsert: true,
				new: true,
			})
			.exec();
	}
	/**
	 * Gets default wordlist
	 */
	async getDefault() {
		const arr = await this.model.find({}).exec();
		return arr[0];
	}
}
