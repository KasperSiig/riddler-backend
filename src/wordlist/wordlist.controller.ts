import { Controller, Get } from '@nestjs/common';
import { Wordlist } from './interfaces/wordlist.interface';
import { WordlistService } from './wordlist.service';
import { DocumentQuery } from 'mongoose';

@Controller('wordlist')
export class WordlistController {
	constructor(private wordlistSvc: WordlistService) {}

	/**
	 * Gets all wordlists saved in database
	 */
	@Get('')
	getAll(): DocumentQuery<Wordlist[], Wordlist, {}> {
		return this.wordlistSvc.getAll();
	}
}