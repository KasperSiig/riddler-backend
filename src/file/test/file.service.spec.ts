import { Test, TestingModule } from '@nestjs/testing';
import { FileService } from '../file.service';
import * as fs from 'fs-extra';
import { of } from 'rxjs';
import { FileNotFoundException } from '../../exceptions';

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
		const spy = jest.spyOn(fs, 'copy').mockImplementation(() => { });
		service.copy('', '');
		expect(spy).toHaveBeenCalled();
	});

	it('should call fs append', () => {
		const spy = jest
			.spyOn(fs, 'appendFile')
			.mockImplementation(() => new Promise(() => { }));
		service.write('', '');
		expect(spy).toHaveBeenCalled();
	});

	it('should throw error if file does not exist', async () => {
		try {
			await service.validateOne('/opt/nofile');
		} catch (err) {
			expect(err.toString()).toBe('Error: File /opt/nofile Not Found');
		}
	});
});