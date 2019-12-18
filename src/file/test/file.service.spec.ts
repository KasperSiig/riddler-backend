import { Test, TestingModule } from '@nestjs/testing';
import { existsSync } from 'fs';
import * as fs from 'fs-extra';
import { FileService } from '../file.service';

describe('FileService', () => {
	let service: FileService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [FileService],
		}).compile();

		service = module.get<FileService>(FileService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should call fs copy', () => {
		const spy = jest.spyOn(fs, 'copy').mockImplementation(() => {});
		service.copy('', '');
		expect(spy).toHaveBeenCalled();
	});

	it('should call fs append', () => {
		const spy = jest
			.spyOn(fs, 'appendFile')
			.mockImplementation(() => new Promise(() => {}));
		service.append('', '');
		expect(spy).toHaveBeenCalled();
	});

	it('should throw error if file does not exist', () => {
		try {
			service.validateOne('/opt/nofile');
		} catch (err) {
			expect(err.toString()).toBe('Error: File /opt/nofile Not Found');
		}
	});

	it('should create new directory', () => {
		const dir = '/tmp/' + Math.ceil(Math.random() * 1000000000000000);
		service.mkdirSync(dir);

		expect(existsSync(dir)).toBeTruthy();
	});

	it('should not create new directory', () => {
		const dir = '/tmp/' + Math.ceil(Math.random() * 1000000000000000);
		service.mkdirSync(dir);
		service.mkdirSync(dir);

		expect(existsSync(dir)).toBeTruthy();
	});
});
