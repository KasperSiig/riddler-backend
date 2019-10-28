import { AppModule } from '../app.module';

describe('AppModule', () => {
	let appModule: AppModule;

	beforeEach(() => {
		appModule = new AppModule();
	});

	it('should be constructed', () => {
		expect(appModule).toBeTruthy();
	});
});
