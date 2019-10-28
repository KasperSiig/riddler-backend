import { FileService } from '../file.service';
describe('FileService', () => {
	let fileService: FileService;

	beforeEach(() => {
		fileService = new FileService();
	});

	it('should be constructed', () => {
		expect(fileService).toBeTruthy();
	});

	it('should read file', () => {
		const readFile = fileService.readFile('src/file/test/testfile.txt');
		expect(readFile).toContain('hello world');

	});
});
