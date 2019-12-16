import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { FileNotFoundException } from '../../exceptions';
import { FileModule } from '../../file';
import { Job } from '../../job';
import { WordlistModule } from '../../wordlist';
import { STATUS } from '../enums/status.enum';
import { HelperService } from '../helper.service';
import { JobDataService } from '../job-data.service';
import { JobController } from '../job.controller';
import { JobService } from '../job.service';
import { JobSchema } from './../schemas/job.schema';

describe('Job Controller', () => {
	let module: TestingModule;
	let controller: JobController;

	let rootBak: string;
	let johnBak: string;

	let jobSvc: JobService;
	let dataSvc: JobDataService;

	beforeAll(() => {
		rootBak = process.env.JTR_ROOT;
		process.env.JTR_ROOT = '/tmp/';
		johnBak = process.env.JTR_EXECUTABLE;
		process.env.JTR_EXECUTABLE = '/tmp/john';
	});

	afterAll(() => {
		process.env.JTR_ROOT = rootBak;
		process.env.JTR_EXECUTABLE = johnBak;
	});

	beforeEach(async () => {
		module = await Test.createTestingModule({
			imports: [
				FileModule,
				MongooseModule.forRoot(process.env.MONGO_URL, {
					useNewUrlParser: true,
					useUnifiedTopology: true,
					useFindAndModify: false,
				}),
				MongooseModule.forFeature([{ name: 'Job', schema: JobSchema }]),
				WordlistModule,
			],
			providers: [JobService, HelperService, JobDataService],
			controllers: [JobController],
		}).compile();

		controller = module.get<JobController>(JobController);
		jobSvc = module.get<JobService>(JobService);
		dataSvc = module.get<JobDataService>(JobDataService);
	});

	afterEach(async () => {
		await module.close();
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	it('should call service to start job', async () => {
		const job = await dataSvc.updateOne({} as Job);
		const spy = jest
			.spyOn(jobSvc, 'startNew')
			.mockImplementation((): any => {});

		controller.startNew({ job: JSON.stringify(job) }, '');
		expect(spy).toHaveBeenCalledTimes(1);
	});

	it('should call service to get details', () => {
		const spy = jest.spyOn(dataSvc, 'getAll');

		controller.getJobs();
		expect(spy).toBeCalledTimes(1);
	});

	it('should get one job', async () => {
		const job = await jobSvc.create({} as Job);

		const spy = jest.spyOn(dataSvc, 'getOne').mockImplementation((): any => {});

		controller.getOne(job._id);

		expect(spy).toHaveBeenCalledTimes(1);
	});

	it('should get all finished jobs', async () => {
		await jobSvc.create({ status: STATUS.FINISHED } as Job);

		const spy = jest.spyOn(dataSvc, 'getManyByStatus');

		controller.getByStatus(STATUS.FINISHED);

		expect(spy).toHaveBeenCalledTimes(1);
	});

	it('should throw error', async () => {
		jest.spyOn(jobSvc, 'startNew').mockImplementation(() => {
			throw new FileNotFoundException('test');
		});
		try {
			await controller.startNew({ job: JSON.stringify({} as Job) }, '');
		} catch (err) {
			expect(err.toString()).toBe('Error: File test Not Found');
		}
	});
});
