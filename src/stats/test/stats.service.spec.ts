import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { FileModule, FileService } from '../../file';
import { Job, JobModule, JobSchema, JobService } from '../../job';
import { StatsService } from '../stats.service';

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
			providers: [StatsService],
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
		let job = {
			name: 'test',
		} as Job;

		job = await jobSvc.create(job);
		job.directory = process.cwd() + '/src/stats/test/files/';
		await jobSvc.update(job);
		const stats = await service.getAdminsCracked(job._id, potFile);
		expect(stats).toEqual({
			total: 3,
			cracked: 1,
			percentage: 33,
		});
	});

	it('should return stats for all users cracked', async () => {
		const potFile = 'src/stats/test/files/john.pot';
		let job = {
			name: 'test',
		} as Job;

		job = await jobSvc.create(job);
		job.directory = process.cwd() + '/src/stats/test/files/';
		await jobSvc.update(job);
		const stats = await service.getAllCracked(job._id, potFile);
		expect(stats).toEqual({
			total: 4,
			cracked: 1,
			percentage: 25,
		});
	});
});
