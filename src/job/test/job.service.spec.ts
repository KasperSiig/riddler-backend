import { Test, TestingModule } from '@nestjs/testing';
import { JobService } from '../job.service';
import * as child_process from 'child_process';
import { spawn, execFile } from 'child_process';
import { FileModule, FileService } from '../../file';

describe('JobService', () => {
	let service: JobService;
	let fileSvc: FileService;
	let job: any;
	let spawnSpy: jest.SpyInstance;
	let envBak: string;

	beforeAll(() => {
		envBak = process.env.JTR_ROOT;
		process.env.JTR_ROOT = '/tmp/';
	});

	afterAll(() => {
		process.env.JTR_ROOT = envBak;
	});

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [FileModule],
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
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should spawn process', async () => {
		const response = service.startNew(job);
		await new Promise(res => {
			response[0].on('exit', code => {
				expect(spawnSpy).toHaveBeenCalled();
				expect(code).toBe(0);
				res(code);
			});
		});
	});

	it('should have all added properties', async () => {
		const res = service.startNew(job);
		expect(Object.keys(res[1]).sort()).toEqual(
			['id', 'file', 'directory'].sort(),
		);
	});

	it('should add process to store', async () => {
		const result = service.startNew(job);
		await new Promise(res => {
			result[0].on('exit', code => {
				expect(service.jobs.length).toBe(1);
				res(code);
			});
		});
	});

	it('should have all added listeners', async () => {
		const process = execFile('ls', ['&&', 'ls', '>', '/dev/stderr']);
		service.startListeners(process, { ...job, directory: '/tmp/' });
		const spy = jest.spyOn(fileSvc, 'write');

		await new Promise(res => {
			// There's always an implicit listener, hence why 2 listeners is expected
			process.on('exit', code => {
				expect(process.stdout.listenerCount('data')).toBe(2);
				expect(process.stderr.listenerCount('data')).toBe(2);
				expect(spy).toHaveBeenCalledTimes(2);
				res(code);
			});
		});
	});
});
