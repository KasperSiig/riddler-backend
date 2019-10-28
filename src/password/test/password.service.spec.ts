import { PasswordService } from '../password.service';

describe('PasswordService', () => {
	let passwordSvc: PasswordService;

	beforeEach(() => {
		passwordSvc = new PasswordService();
	});

	it('should be constructed', () => {
		expect(passwordSvc).toBeTruthy();
	});

	it('should exec many', () => {
		const spy = jest.spyOn(passwordSvc, 'execSingle');
		passwordSvc.execMany(['', '']);
		expect(spy).toHaveBeenCalled();
	});
});
