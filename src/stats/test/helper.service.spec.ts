import { Test, TestingModule } from '@nestjs/testing';
import { FileModule, FileService } from '../../file';
import { HelperService } from '../helper.service';

describe('StatsHelperService', () => {
	let module: TestingModule;
	let service: HelperService;
	let fileSvc: FileService;

	beforeEach(async () => {
		module = await Test.createTestingModule({
			imports: [FileModule],
			providers: [HelperService],
		}).compile();
		service = module.get<HelperService>(HelperService);
		fileSvc = module.get<FileService>(FileService);
	});

	afterEach(async () => {
		await module.close();
	});

	it('should parse passwd with no filter', async () => {
		const passwd = service.parsePasswd(
			await fileSvc.read('src/stats/test/files/passwd.txt'),
		);
		expect(passwd).toEqual([
			'AB987CB169FB0FA623417DEBC88B9750',
			'AB987CB169FB0FA623417DEBC88BC750',
			'AB987CB169FB0FA623417DEBC88BB750',
			'AB987CB169FB0FA623417DEBC88BB750',
		]);
	});

	it('should parse passwd with admin filter', async () => {
		const passwd = service.parsePasswd(
			await fileSvc.read('src/stats/test/files/passwd.txt'),
			service.getFilter('admins'),
		);
		expect(passwd).toEqual([
			'AB987CB169FB0FA623417DEBC88B9750',
			'AB987CB169FB0FA623417DEBC88BB750',
			'AB987CB169FB0FA623417DEBC88BB750',
		]);
	});

	it('should parse pot file with hash as key', async () => {
		const pot = service.parsePot(
			await fileSvc.read('src/stats/test/files/john.pot'),
		);
		expect(pot).toEqual(
			new Map([['ab987cb169fb0fa623417debc88b9750', '#Password']]),
		);
	});

	it('should parse pot file with password as key', async () => {
		const pot = service.parsePot(
			await fileSvc.read('src/stats/test/files/john.pot'),
			false,
		);
		expect(pot).toEqual(
			new Map([['#Password', 'ab987cb169fb0fa623417debc88b9750']]),
		);
	});

	it('should get default filter', () => {
		const arr = ['test', 'test1'];
		const filter = service.getFilter();

		expect(arr.filter(filter)).toEqual(arr);
	});
});
