import { Document } from 'mongoose';
import { STATUS } from '../enums/status.enum';

export interface Job extends Document {
	name: string;
	file: string;
	status?: STATUS;
	format?: string;
	wordlist?: string;
	directory?: string;
	time?: number;
}
