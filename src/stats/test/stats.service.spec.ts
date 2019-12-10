import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { FileModule, FileService } from '../../file';
import { Job, JobModule, JobSchema, JobService } from '../../job';
import { StatsService } from '../stats.service';
import { HelperService } from '../helper.service';

describe('StatsService', () => {
	let service: StatsService;
	let jobSvc: JobService;
	let fileSvc: FileService;
	let envBak: string;
	let module: TestingModule;

	beforeAll(() => {
		envBak = process.env.JTR_ROOT;
		process.env.JTR_ROOT = '/tmp/';
	});

	afterAll(() => {
		process.env.JTR_ROOT = envBak;
	});

	beforeEach(async () => {
		module = await Test.createTestingModule({
			imports: [
				FileModule,
				JobModule,
				MongooseModule.forRoot(process.env.MONGO_URL, {
					useNewUrlParser: true,
					useUnifiedTopology: true,
					useFindAndModify: false,
				}),
				MongooseModule.forFeature([{ name: 'Job', schema: JobSchema }]),
				FileModule,
			],
			providers: [StatsService, HelperService],
		}).compile();

		service = module.get<StatsService>(StatsService);
		jobSvc = module.get<JobService>(JobService);
		fileSvc = module.get<FileService>(FileService);
	});

	afterEach(() => {
		module.close();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should return stats for admins cracked', async () => {
		const potFile = 'src/stats/test/files/john.pot';
		await fileSvc.mkdir(process.env.JTR_ROOT + 'JohnTheRipper/run');
		await fileSvc.write(
			process.env.JTR_ROOT + 'JohnTheRipper/run/john.pot',
			(await fileSvc.read(potFile)).toString(),
		);
		let job = {
			name: 'test',
		} as Job;

		job = await jobSvc.create(job);
		job.directory = process.cwd() + '/src/stats/test/files/';
		await jobSvc.update(job);
		const stats = await service.getAdminsCracked(job._id);
		expect(stats).toEqual({
			total: 3,
			cracked: 1,
			percentage: 33,
		});
	});

	it('should return stats for all users cracked', async () => {
		const potFile = 'src/stats/test/files/john.pot';
		await fileSvc.mkdir(process.env.JTR_ROOT + 'JohnTheRipper/run');
		await fileSvc.write(
			process.env.JTR_ROOT + 'JohnTheRipper/run/john.pot',
			(await fileSvc.read(potFile)).toString(),
		);
		let job = {
			name: 'test',
		} as Job;

		job = await jobSvc.create(job);
		job.directory = process.cwd() + '/src/stats/test/files/';
		await jobSvc.update(job);
		const stats = await service.getAllCracked(job._id);
		expect(stats).toEqual({
			total: 4,
			cracked: 1,
			percentage: 25,
		});
	});

	it('should return a comma seperated string of stats', async () => {
		const potFile = 'src/stats/test/files/john.pot';
		await fileSvc.mkdir(process.env.JTR_ROOT + 'JohnTheRipper/run');
		await fileSvc.write(
			process.env.JTR_ROOT + 'JohnTheRipper/run/john.pot',
			(await fileSvc.read(potFile)).toString(),
		);
		let job = {
			name: 'test',
		} as Job;

		job = await jobSvc.create(job);
		job.directory = process.cwd() + '/src/stats/test/files/';
		await jobSvc.update(job);
		const stats = await service.exportStats(job._id);
		expect(stats).toBe(
			'Name,Total,Cracked,Percentage,Top 10\n' +
				'Admins,3,1,33,#Password:1\n' +
				'All,4,1,25,#Password:1\n',
		);
	});

	it('should return 0 if pot file is empty', async () => {
		let job = {
			name: 'test',
		} as Job;

		job = await jobSvc.create(job);
		job.directory = process.cwd() + '/src/stats/test/files/';
		await jobSvc.update(job);
		const potFile = 'src/stats/test/files/john.empty.pot';
		const stats = await service.getPercentageCracked(job._id, potFile);
		expect(stats).toEqual({ total: 4, cracked: 0, percentage: 0 });
	});

	it('should return correct frequency count', async () => {
		const potFile = 'src/stats/test/files/john.pot';
		await fileSvc.mkdir(process.env.JTR_ROOT + 'JohnTheRipper/run');
		await fileSvc.write(
			process.env.JTR_ROOT + 'JohnTheRipper/run/john.pot',
			(await fileSvc.read(potFile)).toString(),
		);
		let job = {
			name: 'test',
		} as Job;

		job = await jobSvc.create(job);
		job.directory = process.cwd() + '/src/stats/test/files/';
		await jobSvc.update(job);
		const count = await service.getFreqCount(job._id, '#Password');
		expect(count).toBe(1);
	});

	it('should return correct top 10 stats', async () => {
		const potFile = 'src/stats/test/files/john.pot';
		await fileSvc.mkdir(process.env.JTR_ROOT + 'JohnTheRipper/run');
		await fileSvc.write(
			process.env.JTR_ROOT + 'JohnTheRipper/run/john.pot',
			(await fileSvc.read(potFile)).toString(),
		);
		let job = {
			name: 'test',
		} as Job;

		job = await jobSvc.create(job);
		job.directory = process.cwd() + '/src/stats/test/files/';
		await jobSvc.update(job);
		const result = await service.getTopTenStats(job._id);
		expect(result).toEqual([{ password: '#Password', count: 1 }]);
	});
});
