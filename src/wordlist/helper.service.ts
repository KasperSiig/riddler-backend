import { BadRequestException, Injectable } from '@nestjs/common';
import { Wordlist } from './interfaces/wordlist.interface';
import { WordlistDataService } from './wordlist-data.service';

@Injectable()
export class HelperService {
	constructor(private dataSvc: WordlistDataService) {}

	/**
	 * Validates a wordlist
	 *
	 * @param wordlist Wordlist to validate
	 * @param file File to validate
	 */
	async validateWordlist(wordlist: Wordlist, file: any) {
		if (!wordlist.name)
			throw new BadRequestException('Name required', wordlist.name);
		if (await this.dataSvc.getWordlistByName(wordlist.name))
			throw new BadRequestException(
				'Wordlist with that name already exists',
				wordlist.name,
			);
		if (!file) throw new BadRequestException('No file chosen', file);
	}
}
