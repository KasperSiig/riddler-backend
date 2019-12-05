import {
	Controller,
	Get,
	Post,
	Body,
	Delete,
	Param,
	Put,
} from '@nestjs/common';
import { Wordlist } from './interfaces/wordlist.interface';
import { WordlistService } from './wordlist.service';
import { DocumentQuery } from 'mongoose';

@Controller('wordlist')
export class WordlistController {
	constructor(private wordlistSvc: WordlistService) {}

	/**
	 * Creates wordlist
	 * @param wordlist Wordlist to create
	 */
	@Post('')
	create(@Body() wordlist: Wordlist): Promise<Wordlist> {
		return this.wordlistSvc.create(wordlist);
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
