import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentQuery } from 'mongoose';
import { Wordlist } from './interfaces/wordlist.interface';
import { WordlistDataService } from './wordlist-data.service';
import { WordlistService } from './wordlist.service';

@Controller('wordlist')
export class WordlistController {
	constructor(
		private wordlistSvc: WordlistService,
		private dataSvc: WordlistDataService,
	) {}

	/**
	 * Creates wordlist
	 * @param wordlist Wordlist to create
	 */
	@Post('')
	@UseInterceptors(FileInterceptor('file'))
	async create(@Body() body: any, @UploadedFile() file: any): Promise<void> {
		try {
			await this.wordlistSvc.create(
				JSON.parse(body.wordlist) as Wordlist,
				file,
			);
		} catch (err) {
			throw err;
		}
	}

	/**
	 * Gets all wordlists saved in database
	 */
	@Get('')
	getAll(): DocumentQuery<Wordlist[], Wordlist, {}> {
		return this.dataSvc.getAll();
	}

	/**
	 * Updates a given wordlist
	 *
	 * @param id Id of wordlist to update
	 * @param wordlist Content to update in wordlist
	 */
	@Put(':id')
	updateOne(@Param('id') id: string, @Body() wordlist: Wordlist) {
		this.dataSvc.updateOne(id, wordlist).then();
	}

	/**
	 * Deletes wordlist
	 *
	 * @param id Id of wordlist to delete
	 */
	@Delete(':id')
	delete(@Param('id') id: string) {
		this.dataSvc.deleteOne(id).then();
	}
}
