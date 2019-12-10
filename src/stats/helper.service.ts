import { Injectable } from '@nestjs/common';

@Injectable()
export class HelperService {
	/**
	 * Parses a given password file
	 *
	 * @param passwd Password file to filter
	 * @param filter Arrow function used to filter
	 */
	parsePasswd(passwd: Buffer, filter = (p: any) => p) {
		return passwd
			.toString()
			.trim()
			.split('\n')
			.filter(filter)
			.map(p => {
				return p.split(':')[3];
			});
	}

	/**
	 * Parses a given potfile
	 *
	 * @param pot Potfile to parse
	 * @param hashAsKey Whether the password hash should be the key
	 */
	parsePot(pot: Buffer, hashAsKey = true) {
		const potParsed = new Map<string, string>();
		if (pot.toString() === '') return potParsed;
		pot
			.toString()
			.trim()
			.split('\n')
			.map(p => {
				const split = p.split(':');
				if (hashAsKey)
					return potParsed.set(split[0].substr(4).toLowerCase(), split[1]);
				else return potParsed.set(split[1], split[0].substr(4).toLowerCase());
			});
		return potParsed;
	}

	/**
	 * Gets filter to use in parsing functions
	 *
	 * @param filter Filter to get
	 */
	getFilter(filter?: string) {
		switch (filter) {
			case 'admins':
				return p => {
					const split = p.split(',');
					if (split[split.length - 3].toLowerCase().endsWith('true'))
						return true;
					return false;
				};

			default:
				return p => p;
		}
	}
}
