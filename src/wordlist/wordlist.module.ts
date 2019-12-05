import { Module } from '@nestjs/common';
import { WordlistController } from './wordlist.controller';
import { WordlistService } from './wordlist.service';
import { MongooseModule } from '@nestjs/mongoose';
import { WordlistSchema } from './schemas/wordlist.schema';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: 'Wordlist', schema: WordlistSchema }]),
	],
	controllers: [WordlistController],
	providers: [WordlistService],
})
export class WordlistModule {}
