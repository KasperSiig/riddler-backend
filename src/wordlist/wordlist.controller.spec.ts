import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { WordlistSchema } from './schemas/wordlist.schema';
import { WordlistController } from './wordlist.controller';
import { WordlistService } from './wordlist.service';
import { of } from 'rxjs';
import { Wordlist } from './interfaces/wordlist.interface';

describe('Wordlist Controller', () => {
	let controller: WordlistController;
	let module: TestingModule;
	let wordlistSvc: WordlistService;

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
			controllers: [WordlistController],
			providers: [WordlistService],
		}).compile();

		controller = module.get<WordlistController>(WordlistController);
		wordlistSvc = module.get<WordlistService>(WordlistService);
	});

	afterEach(() => {
		module.close();
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	it('should call service get all wordlists', () => {
		const spy = jest.spyOn(wordlistSvc, 'getAll').mockImplementation(() => {
			return wordlistSvc.model.find({});
		});

		controller.getAll();
		expect(spy).toHaveBeenCalledTimes(1);
	});

	it('should call service to create wordlist', () => {
		const wordlist = {
			name: 'wordlist',
			path: '/opt/jtr/wordlist.txt',
		} as Wordlist;
		const spy = jest.spyOn(wordlistSvc, 'create').mockImplementation(wl => {
			return of(wl).toPromise();
		});

		controller.create(wordlist);
		expect(spy).toHaveBeenCalledTimes(1);
	});
});
