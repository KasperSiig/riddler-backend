import { Schema, Types } from 'mongoose';
import { WordlistSchema } from '../../wordlist';

export const JobSchema = new Schema({
	_id: Types.ObjectId,
	name: String,
	status: String,
	format: String,
	rule: String,
	wordlist: WordlistSchema,
	directory: String,
	time: Schema.Types.Date,
});
