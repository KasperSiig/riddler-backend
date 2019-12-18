import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { FileNotFoundException } from '../../exceptions';
import { FileModule } from '../../file';
import { HelperService } from '../helper.service';
import { Wordlist } from '../interfaces/wordlist.interface';
import { WordlistSchema } from '../schemas/wordlist.schema';
import { WordlistDataService } from '../wordlist-data.service';
import { WordlistController } from '../wordlist.controller';
import { WordlistService } from '../wordlist.service';

describe('Wordlist Controller', () => {
	let module: TestingModule;
	let controller: WordlistController;

	let wordlistSvc: WordlistService;
	let dataSvc: WordlistDataService;

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
			controllers: [WordlistController],
			providers: [WordlistService, WordlistDataService, HelperService],
		}).compile();

		controller = module.get<WordlistController>(WordlistController);
		wordlistSvc = module.get<WordlistService>(WordlistService);
		dataSvc = module.get<WordlistDataService>(WordlistDataService);
	});

	afterEach(async () => {
		await module.close();
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	it('should call service get all wordlists', () => {
		const spy = jest.spyOn(dataSvc, 'getAll').mockImplementation((): any => {});

		controller.getAll();
		expect(spy).toHaveBeenCalledTimes(1);
	});

	it('should call service to create wordlist', () => {
		const spy = jest
			.spyOn(wordlistSvc, 'create')
			.mockImplementation((): any => {});

		controller.create({ wordlist: JSON.stringify({}) }, '');
		expect(spy).toHaveBeenCalledTimes(1);
	});

	it('should call service to delete wordlist', () => {
		const spy = jest
			.spyOn(dataSvc, 'deleteOne')
			.mockImplementation((): any => of('').toPromise());
		controller.delete({} as any);
		expect(spy).toHaveBeenCalledTimes(1);
	});

	it('should call service to update wordlist', () => {
		const spy = jest
			.spyOn(dataSvc, 'updateOne')
			.mockImplementation((): any => of('').toPromise());
		controller.updateOne('test', {} as any);
		expect(spy).toHaveBeenCalledTimes(1);
	});

	it('should throw error', async () => {
		jest.spyOn(wordlistSvc, 'create').mockImplementation(() => {
			throw new FileNotFoundException('test');
		});
		try {
			await controller.create({ wordlist: JSON.stringify({} as Wordlist) }, '');
		} catch (err) {
			expect(err.toString()).toBe('Error: File test Not Found');
		}
	});
});
