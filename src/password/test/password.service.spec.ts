import { PasswordService } from '../password.service';

describe('PasswordService', () => {
	const ntlmHash =
		'blackbox.localAdministrator:500:AAD3B435B51404EEAAD3B435B51404EE:AB987CB169FB0FA623417DEBC88B9750:Disabled=False,Expired=False,PasswordNeverExpires=True,PasswordNotRequired=False,PasswordLastChanged=201910211025,LastLogonTimestamp=160101010000,IsAdministrator=True,IsDomainAdmin=True,IsEnterpriseAdmin=True::';
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

	if (process.platform === 'linux') {
		it('should exec a single ntlm hash', async () => {
			const output = await passwordSvc.execSingle(ntlmHash);
			expect(output.stdout.toString()).toContain('Loaded 1 password hash');
		});
	}
});
