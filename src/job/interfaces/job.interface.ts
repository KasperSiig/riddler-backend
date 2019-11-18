import { Document } from 'mongoose';
import { STATUS } from '../enums/status.enum';
import { ChildProcess } from 'child_process';

export interface Job extends Document {
	id?: string;
	file: string;
	status?: STATUS;
	format?: string;
	wordlist?: string;
	directory?: string;
	child?: ChildProcess;
}
