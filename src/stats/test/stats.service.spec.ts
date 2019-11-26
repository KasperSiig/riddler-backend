import { Test, TestingModule } from '@nestjs/testing';
import { StatsService } from '../stats.service';
import { STATUS, JobModule, JobSchema, JobService, Job } from '../../job';
import { MongooseModule } from '@nestjs/mongoose';
import { FileModule, FileService } from '../../file';

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
			file: process.cwd() + '/src/stats/test/files/passwd.txt',
			name: 'test',
		} as Job;

		job = await jobSvc.create(job);
		await fileSvc.copy(
			job.file,
			process.env.JTR_ROOT + 'jobs/' + job._id + '/passwd.txt',
		);
		const stats = await service.getAdminsCracked(job._id, potFile);
		expect(stats).toEqual({
			total: 3,
			cracked: 1,
			percentage: 33,
		});
	});
});
