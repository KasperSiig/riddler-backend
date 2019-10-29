import { Injectable } from '@nestjs/common';
import { promisify } from 'util';
import { exec } from 'child_process';
const execPromise = promisify(exec);

@Injectable()
export class PasswordService {
	execMany(passwds: string[]) {
		return passwds.forEach(pass => this.execSingle(pass));
	}

	async execSingle(passwd: string) {
		switch (process.platform) {
			case 'linux':
				return this.execLinux(passwd);
		}
	}

	async execLinux(
		passwd: string,
		format = 'nt',
		wordlist = '/opt/john/wordlist.txt',
	) {
		return await execPromise(
			'echo ' +
				passwd +
				' | ' +
				process.env.JOHN_EXECUTABLE +
				' --format=' +
				format +
				' /dev/stdin --wordlist=' +
				wordlist,
		);
	}
}
