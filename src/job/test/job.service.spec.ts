import { Test, TestingModule } from '@nestjs/testing';
import { JobService } from '../job.service';
import * as child_process from 'child_process';
import { spawn, execFile } from 'child_process';
import { FileModule, FileService } from '../../file';
import { MongooseModule } from '@nestjs/mongoose';
import { JobSchema } from '../schemas/job.schema';

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

	it('should spawn process', async () => {
		const jobSpawned = service.startNew(job);
		await new Promise(res => {
			jobSpawned.child.on('exit', code => {
				expect(spawnSpy).toHaveBeenCalled();
				expect(code).toBe(0);
				res(code);
			});
		});
	});

	it('should have all added properties', async () => {
		const jobSpawned = service.startNew(job);
		expect(Object.keys(jobSpawned).sort()).toEqual(
			['id', 'file', 'directory', 'child', 'status'].sort(),
		);
	});

	it('should have all added listeners', async () => {
		const child = execFile('ls', ['&&', 'ls', '>', '/dev/stderr']);
		service.startListeners({ ...job, directory: '/tmp/', child });
		const spy = jest.spyOn(fileSvc, 'write');

		await new Promise(res => {
			// There's always an implicit listener, hence why 2 listeners is expected
			child.on('exit', code => {
				expect(child.stdout.listenerCount('data')).toBe(2);
				expect(child.stderr.listenerCount('data')).toBe(2);
				expect(child.listenerCount('exit')).toBe(2);
				// expect(spy).toHaveBeenCalled();
				res(code);
			});
		});
	});
});
