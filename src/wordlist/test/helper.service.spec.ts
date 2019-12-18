import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { HelperService } from '../helper.service';
import { WordlistSchema } from '../schemas/wordlist.schema';
import { WordlistDataService } from '../wordlist-data.service';

describe('HelperService', () => {
	let module: TestingModule;
	let service: HelperService;

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
			providers: [HelperService, WordlistDataService],
		}).compile();

		service = module.get<HelperService>(HelperService);
	});

	afterEach(async () => {
		await module.close();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
