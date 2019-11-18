import { Document } from 'mongoose';
import { STATUS } from '../enums/status.enum';

export interface Job extends Document {
	id?: string;
	file: string;
	status?: STATUS;
	format?: string;
	wordlist?: string;
	directory?: string;
}
