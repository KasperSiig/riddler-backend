import { Injectable } from '@nestjs/common';
import { promisify } from 'util';
import { exec } from 'child_process';
const execPromise = promisify(exec);

@Injectable()
export class PasswordService {
	execMany(passwds: string[]) {
		return passwds.forEach(pass => this.execSingle(pass));
	}

	execSingle(passwd: string) {}
}
