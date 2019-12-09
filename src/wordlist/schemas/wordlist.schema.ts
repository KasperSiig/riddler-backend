import { Schema, Types } from 'mongoose';

export const WordlistSchema = new Schema({
	_id: Types.ObjectId,
	name: String,
	path: String,
});
