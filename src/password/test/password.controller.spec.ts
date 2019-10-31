import { PasswordController } from '../password.controller';
import { PasswordService } from '../password.service';
import { of } from 'rxjs';

describe('PasswordController', () => {
	let passwordController: PasswordController;
	let passwordSvc: PasswordService;

	beforeEach(() => {
		passwordSvc = new PasswordService();
		passwordController = new PasswordController(passwordSvc);
	});

	it('should call execMany', async () => {
		const passwds = [''];
		const result = [{ stdout: 'test', stderr: '' }];
		jest.spyOn(passwordSvc, 'execMany').mockImplementation(() => of(result).toPromise());

		expect(await passwordController.guessPasswords(passwds)).toBe(result);
	});
});
