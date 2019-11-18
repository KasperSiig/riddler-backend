import { Test, TestingModule } from '@nestjs/testing';
import { JobService } from '../job.service';
import * as child_process from 'child_process';
import { spawn, execFile } from 'child_process';
import { FileModule, FileService } from '../../file';
import { MongooseModule } from '@nestjs/mongoose';
import { JobSchema } from '../schemas/job.schema';
import { Types } from 'mongoose';

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
			],
			providers: [JobService],
		}).compile();

		service = module.get<JobService>(JobService);
		fileSvc = module.get<FileService>(FileService);
		job = { file: 'src/job/test/files/passwd.txt' };

		spawnSpy = jest
			.spyOn(child_process, 'spawn')
			.mockImplementation(() => execFile('ls'));
	});

	afterEach(() => {
		spawnSpy.mockRestore();
		module.close();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should spawn process', async done => {
		const child = await service.startNew(job);
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
});
