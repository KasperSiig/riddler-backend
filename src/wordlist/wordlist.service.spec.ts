import { Test, TestingModule } from '@nestjs/testing';
import { WordlistService } from './wordlist.service';
import { MongooseModule } from '@nestjs/mongoose';
import { WordlistSchema } from './schemas/wordlist.schema';
import { Wordlist } from './interfaces/wordlist.interface';
import { FileModule } from '../file';
import { Job } from '../job';
import any = jasmine.any;

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
				FileModule,
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
		const wordlistCreated = await service.create(wordlist as Wordlist, {
			buffer: '',
		});
		const wordlistRtn = await service.getAll();
		expect(wordlistRtn[0].toObject()).toEqual(wordlistCreated.toObject());
	});

	it('should return the default wordlist', async () => {
		const wordlist = { name: 'wordlist', path: '/opt/jtr/wordlist.txt' };
		const wordlistCreated = await service.create(wordlist as Wordlist, {
			buffer: '',
		});
		const wordlistRtn = await service.getDefault();
		expect(wordlistRtn.toObject()).toEqual(wordlistCreated.toObject());
	});

	it('should delete a wordlist', async () => {
		const wordlist = { name: 'wordlist', path: '/opt/jtr/wordlist.txt' };
		const wordlistCreated = await service.create(wordlist as Wordlist, {
			buffer: '',
		});
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

		let wordlistCreated = (await service.create(wordlist, {
			buffer: '',
		})).toObject();
		expect((await service.getAll()).map(o => o.toObject())).toEqual([
			wordlistCreated,
		]);

		wordlistCreated = { ...wordlistCreated, name: 'update' };

		await service.updateOne(wordlistCreated._id, wordlistCreated);
		expect((await service.getOne(wordlistCreated._id)).toObject()).toEqual(
			wordlistCreated,
		);
	});

	it('should throw an error on name required', async () => {
		try {
			await service.create(
				{
					name: '',
					path: 'src/job/test/files/wordlist.txt',
				} as Wordlist,
				'',
			);
		} catch (err) {
			expect(err.toString()).toBe(
				'Error: {"statusCode":400,"error":"","message":"Name required"}',
			);
		}
	});

	it('should throw error on existing name', async () => {
		const newWordlist = {
			name: 'test',
		} as Wordlist;
		await service.create(newWordlist, { buffer: '' });

		try {
			await service.create(
				{
					name: 'test',
				} as Wordlist,
				{ buffer: '' },
			);
		} catch (err) {
			expect(err.toString()).toBe(
				'Error: {"statusCode":400,"error":"test","message":"Wordlist with that name already exists"}',
			);
		}
	});

	it('should throw error if no file is chosen', async () => {
		try {
			await service.create(
				{
					name: 'test',
					path: null,
				} as Wordlist,
				'',
			);
		} catch (err) {
			expect(err.toString()).toBe(
				'Error: {"statusCode":400,"error":"","message":"No file chosen"}',
			);
		}
	});
});
