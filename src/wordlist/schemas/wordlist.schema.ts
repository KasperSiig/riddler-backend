import { Schema } from 'mongoose';

export const WordlistSchema = new Schema({
	_id: String,
	name: String,
	path: String,
});
