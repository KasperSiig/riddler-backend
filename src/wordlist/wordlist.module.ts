import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileModule } from '../file';
import { HelperService } from './helper.service';
import { WordlistSchema } from './schemas/wordlist.schema';
import { WordlistDataService } from './wordlist-data.service';
import { WordlistController } from './wordlist.controller';
import { WordlistService } from './wordlist.service';

@Module({
	imports: [
		FileModule,
		MongooseModule.forFeature([{ name: 'Wordlist', schema: WordlistSchema }]),
	],
	controllers: [WordlistController],
	providers: [WordlistService, HelperService, WordlistDataService],
	exports: [WordlistService],
})
export class WordlistModule {}
