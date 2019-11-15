import { Schema } from 'mongoose';

export const JobSchema = new Schema({
	_id: String,
	file: String,
	status: String,
	format: String,
	wordlist: String,
	directory: String,
});
