import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DocumentQuery, Model, Types } from 'mongoose';
import { Wordlist } from './interfaces/wordlist.interface';
import { FileService } from '../file';

@Injectable()
export class WordlistService {
	constructor(
		@InjectModel('Wordlist') public readonly model: Model<Wordlist>,
		private fileSvc: FileService,
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
	 * Creates a wordlist
	 *
	 * @param wordlist Wordlist to create
	 */
	async create(wordlist: Wordlist, file: any): Promise<Wordlist> {
		wordlist._id = new Types.ObjectId().toString();
		wordlist.path = process.env.JTR_ROOT + 'wordlist/' + wordlist._id + '.txt';

		// validation
		if (!wordlist.name)
			throw new BadRequestException('Name required', wordlist.name);
		if (await this.getWordlistByName(wordlist.name))
			throw new BadRequestException(
				'Wordlist with that name already exists',
				wordlist.name,
			);
		if (!file)
			throw new BadRequestException('No file chosen', file);

		this.fileSvc.mkdir(process.env.JTR_ROOT + 'wordlist/');
		await this.fileSvc.write(wordlist.path, file.buffer.toString());
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
	async getDefault(): Promise<Wordlist> {
		const arr = await this.model.find({}).exec();
		return arr[0];
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

	private async getWordlistByName(name: string) {
		return this.model.findOne({ name });
	}
}
