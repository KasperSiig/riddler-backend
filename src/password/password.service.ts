import { Injectable } from '@nestjs/common';
import { promisify } from 'util';
import { exec } from 'child_process';
const execPromise = promisify(exec);

@Injectable()
export class PasswordService {
	execMany(passwds: string[]) {
		return passwds.forEach(pass => this.execSingle(pass));
	}

	execSingle(passwd: string) {
		switch (process.platform) {
			case 'linux':
				this.execLinux(passwd);
		}
	}

	execLinux(passwd: string) {
		execPromise(
			'echo ' +
				passwd +
				' | ' +
				process.env.JOHN_EXECUTABLE +
				' --format=nt /dev/stdin --wordlist=/opt/john/wordlist.txt',
		).then(data => console.log(data));
	}
}
