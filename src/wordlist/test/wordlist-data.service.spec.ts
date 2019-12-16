import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { WordlistSchema } from '../schemas/wordlist.schema';
import { WordlistDataService } from '../wordlist-data.service';

describe('WordlistDataService', () => {
	let service: WordlistDataService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				MongooseModule.forRoot(process.env.MONGO_URL, {
					useNewUrlParser: true,
					useUnifiedTopology: true,
					useFindAndModify: false,
				}),
				MongooseModule.forFeature([
					{ name: 'Wordlist', schema: WordlistSchema },
				]),
			],
			providers: [WordlistDataService],
		}).compile();

		service = module.get<WordlistDataService>(WordlistDataService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
