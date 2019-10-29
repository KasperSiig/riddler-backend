import { Injectable } from '@nestjs/common';
import { promisify } from 'util';
import { exec } from 'child_process';
const execPromise = promisify(exec);

@Injectable()
export class PasswordService {
	execMany(
		passwds: string[],
		format = 'nt',
		wordlist = '/opt/jtr/wordlist.txt',
	) {
		return Promise.all(
			passwds.map(async pass => await this.execSingle(pass, format, wordlist)),
		);
	}

	execSingle(
		passwd: string,
		format = 'nt',
		wordlist = '/opt/jtr/wordlist.txt',
	) {
		return execPromise(
			'echo ' +
				passwd +
				' | ' +
				process.env.JTR_EXECUTABLE +
				' --format=' +
				format +
				' /dev/stdin --wordlist=' +
				wordlist,
		);
	}
}
