import { Schema } from 'mongoose';
import { WordlistSchema } from '../../wordlist';

export const JobSchema = new Schema({
	_id: String,
	name: String,
	status: String,
	format: String,
	wordlist: WordlistSchema,
	directory: String,
	time: Schema.Types.Date,
});
