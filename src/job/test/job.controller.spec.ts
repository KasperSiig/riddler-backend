import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { execFile } from 'child_process';
import { FileModule } from '../../file';
import { Job } from '../../job';
import { JobController } from '../job.controller';
import { JobService } from '../job.service';
import { JobSchema } from './../schemas/job.schema';
import { of } from 'rxjs';
import { STATUS } from '../enums/status.enum';
import { FileNotFoundException } from '../../exceptions';

describe('Job Controller', () => {
	let controller: JobController;
	let jobSvc: JobService;
	let module: TestingModule;
	let envBak: string;

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
				MongooseModule.forRoot(process.env.MONGO_URL, {
					useNewUrlParser: true,
					useUnifiedTopology: true,
					useFindAndModify: false,
				}),
				MongooseModule.forFeature([{ name: 'Job', schema: JobSchema }]),
			],
			providers: [JobService],
			controllers: [JobController],
		}).compile();

		controller = module.get<JobController>(JobController);
		jobSvc = module.get<JobService>(JobService);
	});

	afterEach(() => {
		module.close();
	});

	it('should be defined', async () => {
		expect(controller).toBeDefined();
	});

	it('should call service to start job', async () => {
		let job = { } as Job;
		job = await jobSvc.update(job);
		jest
			.spyOn(jobSvc, 'startNew')
			.mockImplementation(() => of(execFile('ls')).toPromise());

		controller.startNew({job: JSON.stringify(job)}, '');
		expect(jobSvc.startNew).toHaveBeenCalledTimes(1);
	});

	it('should call service to get details', () => {
		const spy = jest.spyOn(jobSvc, 'getAll');

		controller.getJobs();
		expect(spy).toBeCalledTimes(1);
	});

	it('should get one job', async () => {
		let job = { } as Job;
		job = await jobSvc.create(job);

		const spy = jest.spyOn(jobSvc, 'getJob');

		await controller.get(job._id);

		expect(spy).toHaveBeenCalledTimes(1);
	});

	it('should get all finished jobs', async () => {
		let job = {
			status: STATUS.FINISHED,
		} as Job;
		job = await jobSvc.create(job);

		const spy = jest.spyOn(jobSvc, 'getByStatus');

		await controller.getByStatus(STATUS.FINISHED);

		expect(spy).toHaveBeenCalledTimes(1);
	});

	it('should throw error', async () => {
		jest.spyOn(jobSvc, 'startNew').mockImplementation(() => {
			throw new FileNotFoundException('test');
		});
		try {
			await controller.startNew({job: JSON.stringify({} as Job)}, '');
		} catch (err) {
			expect(err.toString()).toBe('Error: File test Not Found');
		}
	});
});
