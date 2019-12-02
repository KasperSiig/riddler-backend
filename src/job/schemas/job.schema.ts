import { Schema } from 'mongoose';

export const JobSchema = new Schema({
	_id: String,
	name: String,
	status: String,
	format: String,
	wordlist: String,
	directory: String,
	time: Schema.Types.Date,
});
