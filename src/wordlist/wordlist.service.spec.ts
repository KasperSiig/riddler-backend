import { Test, TestingModule } from '@nestjs/testing';
import { WordlistService } from './wordlist.service';
import { MongooseModule } from '@nestjs/mongoose';
import { WordlistSchema } from './schemas/wordlist.schema';
import { Wordlist } from './interfaces/wordlist.interface';

describe('WordlistService', () => {
	let service: WordlistService;
	let module: TestingModule;

	beforeEach(async () => {
		module = await Test.createTestingModule({
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
			providers: [WordlistService],
		}).compile();

		afterEach(() => {
			module.close();
		});

		service = module.get<WordlistService>(WordlistService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should return all wordlists', async () => {
		const wordlist = { name: 'wordlist', path: '/opt/jtr/wordlist.txt' };
		const wordlistCreated = await service.create(wordlist as Wordlist);
		const wordlistRtn = await service.getAll();
		expect(wordlistRtn[0].toObject()).toEqual(wordlistCreated.toObject());
	});
});
