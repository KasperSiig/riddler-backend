import { STATUS } from './Status.enum';
import { ChildProcess } from 'child_process';

export class Job {
	id?: string;
	file: string;
	status?: STATUS;
	format?: string;
	wordlist?: string;
	directory?: string;
	child?: ChildProcess;
}
