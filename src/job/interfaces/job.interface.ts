import { Document } from 'mongoose';
import { STATUS } from '../enums/status.enum';
import { Wordlist } from '../../wordlist';

export interface Job extends Document {
	name: string;
	status?: STATUS;
	format?: string;
	rule?: string;
	wordlist?: Wordlist;
	directory?: string;
	time?: number;
}
