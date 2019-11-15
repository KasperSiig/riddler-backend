import { FileModule } from '../file.module';

describe('FileModule', () => {
	let fileModule: FileModule;

	beforeEach(() => {
		fileModule = new FileModule();
	});

	it('should be constructed', () => {
		expect(fileModule).toBeTruthy();
	});
});
