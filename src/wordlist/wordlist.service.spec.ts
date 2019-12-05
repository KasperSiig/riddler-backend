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

		service = module.get<WordlistService>(WordlistService);
	});

	afterEach(async () => {
		await service.model.deleteMany({});
		module.close();
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

	it('should return the default wordlist', async () => {
		const wordlist = { name: 'wordlist', path: '/opt/jtr/wordlist.txt' };
		const wordlistCreated = await service.create(wordlist as Wordlist);
		const wordlistRtn = await service.getDefault();
		expect(wordlistRtn.toObject()).toEqual(wordlistCreated.toObject());
	});

	it('should delete a wordlist', async () => {
		const wordlist = { name: 'wordlist', path: '/opt/jtr/wordlist.txt' };
		const wordlistCreated = await service.create(wordlist as Wordlist);
		expect((await service.getAll()).map(o => o.toObject())).toEqual([
			wordlistCreated.toObject(),
		]);
		service.deleteOne(wordlistCreated._id).then();
		expect((await service.getAll()).length).toBe(0);
	});

	it('should update a wordlist', async () => {
		const wordlist = {
			name: 'wordlist',
			path: '/opt/jtr/wordlist.txt',
		} as Wordlist;

		let wordlistCreated = (await service.create(wordlist)).toObject();
		expect((await service.getAll()).map(o => o.toObject())).toEqual([
			wordlistCreated,
		]);

		wordlistCreated = { ...wordlistCreated, name: 'update' };

		await service.updateOne(wordlistCreated._id, wordlistCreated);
		expect((await service.getOne(wordlistCreated._id)).toObject()).toEqual(
			wordlistCreated,
		);
	});
});
