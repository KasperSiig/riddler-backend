import { DetailsModule } from '../details.module';

describe('DetailsModule', () => {
	let detailsModule: DetailsModule;

	beforeEach(() => {
		detailsModule = new DetailsModule();
	});

	it('should be constructed', () => {
		expect(detailsModule).toBeTruthy();
	});
});
