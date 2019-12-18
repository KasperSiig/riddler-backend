import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import * as child_process from 'child_process';
import { execFile } from 'child_process';
import { FileModule, FileService } from '../../file';
import { WordlistModule } from '../../wordlist';
import { STATUS } from '../enums/status.enum';
import { HelperService } from '../helper.service';
import { Job } from '../interfaces/job.interface';
import { JobDataService } from '../job-data.service';
import { JobService } from '../job.service';
import { JobSchema } from '../schemas/job.schema';

describe('JobService', () => {
	let module: TestingModule;
	let service: JobService;

	let rootBak: string;
	let johnBak: string;

	let fileSvc: FileService;
	let dataSvc: JobDataService;

	beforeAll(() => {
		rootBak = process.env.JTR_ROOT;
		process.env.JTR_ROOT = '/tmp/';
		johnBak = process.env.JTR_EXECUTABLE;
		process.env.JTR_EXECUTABLE = '/tmp/john';
	});

	afterAll(() => {
		process.env.JTR_ROOT = rootBak;
		process.env.JTR_EXECUTABLE = johnBak;
	});

	beforeEach(async () => {
		module = await Test.createTestingModule({
			imports: [
				FileModule,
				MongooseModule.forRoot(process.env.MONGO_URL, {
					useNewUrlParser: true,
					useUnifiedTopology: true,
					useFindAndModify: false,
				}),
				MongooseModule.forFeature([{ name: 'Job', schema: JobSchema }]),
				WordlistModule,
			],
			providers: [JobService, HelperService, JobDataService],
		}).compile();

		service = module.get<JobService>(JobService);
		fileSvc = module.get<FileService>(FileService);
		dataSvc = module.get<JobDataService>(JobDataService);

		await dataSvc.model.deleteMany({});
	});

	afterEach(async () => {
		await module.close();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should spawn process', async done => {
		const spy = jest
			.spyOn(child_process, 'spawn')
			.mockImplementation(() => execFile('ls'));

		const job = {
			name: 'test',
			wordlist: { path: 'src/job/test/files/wordlist.txt' },
		};

		(await service.startNew(job as Job, {
			buffer: '',
		})).on('exit', () => {
			expect(spy).toHaveBeenCalled();
			done();
		});
	});

	it('should have all added listeners', async done => {
		const child = execFile('ls');
		service.startListeners({} as Job, child);
		jest.spyOn(fileSvc, 'append').mockImplementation((): any => {});

		// There's always an implicit listener, hence why 2 listeners is expected
		child.on('exit', () => {
			expect(child.stdout.listenerCount('data')).toBe(2);
			expect(child.stderr.listenerCount('data')).toBe(2);
			expect(child.listenerCount('exit')).toBe(2);
			done();
		});
	});

	it('should get one job', async () => {
		const jobCreated = await service.create({} as Job);
		const jobRtn = await dataSvc.getOne(jobCreated._id);

		expect(jobCreated.toObject()).toEqual(jobRtn.toObject());
	});

	it('should get all finished jobs', async () => {
		const job = await service.create({ status: STATUS.FINISHED } as Job);

		const jobRtn = await dataSvc.getManyByStatus(STATUS.FINISHED);
		expect(jobRtn).toContainEqual(expect.objectContaining(job.toObject()));
	});

	it('should throw error on wordlist', async () => {
		try {
			await service.startNew(
				{
					name: 'test',
					wordlist: { name: '', path: ':?' },
				} as Job,
				'',
			);
		} catch (err) {
			expect(err.toString()).toBe(
				'Error: {"statusCode":400,"error":":?","message":"Wordlist not valid"}',
			);
		}
	});

	it('should throw an error on name required', async () => {
		try {
			await service.startNew(
				{
					wordlist: { name: '', path: 'src/job/test/files/wordlist.txt' },
				} as Job,
				'',
			);
		} catch (err) {
			expect(err.toString()).toBe(
				'Error: {"statusCode":400,"error":"Bad Request","message":"Name required"}',
			);
		}
	});

	it('should throw error on existing name', async () => {
		await service.create({
			name: 'test',
		} as Job);

		try {
			await service.startNew(
				{
					name: 'test',
					wordlist: { name: '', path: 'src/job/test/files/wordlist.txt' },
				} as Job,
				'',
			);
		} catch (err) {
			expect(err.toString()).toBe(
				'Error: {"statusCode":400,"error":"test","message":"Job with that name already exists"}',
			);
		}
	});

	it('should throw error if no file is chosen', async () => {
		try {
			await service.startNew(
				{
					name: 'test',
					wordlist: { name: '', path: 'src/job/test/files/wordlist.txt' },
				} as Job,
				'',
			);
		} catch (err) {
			expect(err.toString()).toBe(
				'Error: {"statusCode":400,"error":"","message":"No file chosen"}',
			);
		}
	});

	it('should throw error on format', async () => {
		try {
			await service.startNew(
				{
					name: 'test',
					format: 'invalid',
					wordlist: { name: '', path: 'wordlist.txt' },
				} as Job,
				'',
			);
		} catch (err) {
			expect(err.toString()).toBe(
				'Error: {"statusCode":400,"error":"invalid","message":"Format not valid"}',
			);
		}
	});
});
