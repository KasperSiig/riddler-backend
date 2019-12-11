import {
	Controller,
	Get,
	Post,
	Body,
	Delete,
	Param,
	Put, UseInterceptors, UploadedFile,
} from '@nestjs/common';
import { Wordlist } from './interfaces/wordlist.interface';
import { WordlistService } from './wordlist.service';
import { DocumentQuery } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('wordlist')
export class WordlistController {
	constructor(private wordlistSvc: WordlistService) {}

	/**
	 * Creates wordlist
	 * @param wordlist Wordlist to create
	 */
	@Post('')
	@UseInterceptors(FileInterceptor('file'))
	async create(@Body() body: any, @UploadedFile() file) {
		try {
			await this.wordlistSvc.create(JSON.parse(body.wordlist) as Wordlist, file);
			console.log(file);
		} catch (err) {
			console.log(err);
			throw err;
		}
	}

	/**
	 * Gets all wordlists saved in database
	 */
	@Get('')
	getAll(): DocumentQuery<Wordlist[], Wordlist, {}> {
		return this.wordlistSvc.getAll();
	}

	/**
	 * Updates a given wordlist
	 *
	 * @param id Id of wordlist to update
	 * @param wordlist Content to update in wordlist
	 */
	@Put(':id')
	updateOne(@Param('id') id: string, @Body() wordlist: Wordlist) {
		this.wordlistSvc.updateOne(id, wordlist).then();
	}

	/**
	 * Deletes wordlist
	 *
	 * @param id Id of wordlist to delete
	 */
	@Delete(':id')
	delete(@Param('id') id: string) {
		this.wordlistSvc.deleteOne(id).then();
	}
}
