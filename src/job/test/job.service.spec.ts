import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import * as child_process from 'child_process';
import { execFile } from 'child_process';
import { FileModule, FileService } from '../../file';
import { JobService } from '../job.service';
import { JobSchema } from '../schemas/job.schema';
import { STATUS } from '../enums/status.enum';
import { Job } from '../interfaces/job.interface';
import { WordlistModule } from '../../wordlist';

describe('JobService', () => {
	let service: JobService;
	let fileSvc: FileService;
	let job: any;
	let spawnSpy: jest.SpyInstance;
	let envBak: string;
	let module: TestingModule;

	beforeAll(() => {
		envBak = process.env.JTR_ROOT;
		process.env.JTR_ROOT = '/tmp/';
	});

	afterAll(() => {
		process.env.JTR_ROOT = envBak;
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
			providers: [JobService],
		}).compile();

		service = module.get<JobService>(JobService);
		fileSvc = module.get<FileService>(FileService);
		job = {
			file: 'src/job/test/files/passwd.txt',
			name: 'test',
			wordlist: { name: 'default', path: 'src/job/test/files/wordlist.txt' },
		};

		spawnSpy = jest
			.spyOn(child_process, 'spawn')
			.mockImplementation(() => execFile('ls'));
	});

	afterEach(async () => {
		await service.model.deleteMany({});
		spawnSpy.mockRestore();
		module.close();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should spawn process', async done => {
		const child = await service.startNew(job, { buffer: '' });
		child.on('exit', () => {
			expect(spawnSpy).toHaveBeenCalled();
			done();
		});
	});

	it('should have all added listeners', async done => {
		const child = execFile('ls', ['&&', 'ls', '>', '/dev/stderr']);
		service.startListeners(job, child);
		jest.spyOn(fileSvc, 'write');

		// There's always an implicit listener, hence why 2 listeners is expected
		child.on('exit', () => {
			expect(child.stdout.listenerCount('data')).toBe(2);
			expect(child.stderr.listenerCount('data')).toBe(2);
			expect(child.listenerCount('exit')).toBe(2);
			done();
		});
	});

	it('should get one job', async () => {
		const jobCreated = await service.create(job);
		const jobRtn = await service.getJob(jobCreated._id);

		expect(jobCreated.toObject()).toEqual(jobRtn.toObject());
	});

	it('should get all finished jobs', async () => {
		let newJob = {
			status: STATUS.FINISHED,
		} as Job;
		newJob = await service.create(newJob);

		const jobRtn = await service.getByStatus(STATUS.FINISHED);
		expect(jobRtn).toContainEqual(expect.objectContaining(newJob.toObject()));
	});

	it('should throw error on wordlist', async () => {
		try {
			await service.startNew({ wordlist: { name: '', path: ':?' } } as Job, '');
		} catch (err) {
			expect(err.toString()).toBe(
				'Error: {"statusCode":400,"error":":?","message":"Wordlist not valid"}',
			);
		}
	});

	it('should throw error on format', async () => {
		try {
			await service.startNew(
				{
					format: 'ntlm',
					wordlist: { name: '', path: 'wordlist.txt' },
				} as Job,
				'',
			);
		} catch (err) {
			expect(err.toString()).toBe(
				'Error: {"statusCode":400,"error":"ntlm","message":"Format not valid"}',
			);
		}
	});
});
