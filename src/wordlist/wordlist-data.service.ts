import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DocumentQuery, Model } from 'mongoose';
import { Wordlist } from './interfaces/wordlist.interface';

@Injectable()
export class WordlistDataService {
	constructor(
		@InjectModel('Wordlist') public readonly model: Model<Wordlist>,
	) {}
	/**
	 * Finds wordlist based on Id
	 *
	 * @param id Id of wordlist to find
	 */
	getOne(id: string): DocumentQuery<Wordlist, Wordlist, {}> {
		return this.model.findById(id);
	}

	/**
	 * Gets all wordlists saved in database
	 */
	getAll(): DocumentQuery<Wordlist[], Wordlist, {}> {
		return this.model.find({});
	}

	/**
	 * Deletes wordlist
	 *
	 * @param id Id of wordlist to delete
	 */
	deleteOne(id: string) {
		return this.model.deleteOne({ _id: id });
	}

	/**
	 * Updates a given wordlist. Wordlist is found based on _id property
	 *
	 * @param wordlist Wordlist to update
	 */
	// tslint:disable-next-line: variable-name
	updateOne(_id: string, wordlist: Wordlist) {
		return this.model.findOneAndUpdate({ _id }, wordlist, {
			new: true,
		});
	}

	/**
	 * Finds wordlist by a given name
	 *
	 * @param name Name to find Wordlist by
	 */
	async getWordlistByName(name: string) {
		return this.model.findOne({ name });
	}

	findOneAndUpdate(wordlist: Wordlist) {
		return this.model.findOneAndUpdate({ _id: wordlist._id }, wordlist, {
			upsert: true,
			new: true,
		});
	}
}
