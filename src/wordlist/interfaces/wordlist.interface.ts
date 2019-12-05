import { Document } from 'mongoose';

export interface Wordlist extends Document {
	_id: string;
	name: string;
	path: string;
}
