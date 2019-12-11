import { Module } from '@nestjs/common';
import { WordlistController } from './wordlist.controller';
import { WordlistService } from './wordlist.service';
import { MongooseModule } from '@nestjs/mongoose';
import { WordlistSchema } from './schemas/wordlist.schema';
import { FileModule } from '../file';

@Module({
	imports: [
		FileModule,
		MongooseModule.forFeature([{ name: 'Wordlist', schema: WordlistSchema }]),
	],
	controllers: [WordlistController],
	providers: [WordlistService],
	exports: [WordlistService],
})
export class WordlistModule {}
