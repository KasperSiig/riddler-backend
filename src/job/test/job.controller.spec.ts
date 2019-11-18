import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { execFile } from 'child_process';
import { FileModule } from '../../file';
import { Job } from '../../job';
import { JobController } from '../job.controller';
import { JobService } from '../job.service';
import { JobSchema } from './../schemas/job.schema';
import { of } from 'rxjs';

describe('Job Controller', () => {
	let controller: JobController;
	let jobSvc: JobService;
	let module: TestingModule;

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
		let job = { file: 'src/job/test/files/passwd.txt' } as Job;
		job = await jobSvc.update(job);
		jest
			.spyOn(jobSvc, 'startNew')
			.mockImplementation(() => of(execFile('ls')).toPromise());

		controller.startNew(job);
		expect(jobSvc.startNew).toHaveBeenCalledTimes(1);
	});


	it('should call service to get details', () => {
		const spy = jest.spyOn(jobSvc, 'getAll').mockImplementation(() => {});

		controller.getJobs();
		expect(spy).toBeCalledTimes(1);

	it('should get one job', async () => {
		let job = { _id: '1', file: 'src/job/test/files/passwd.txt' } as Job;
		job = await jobSvc.create(job);

		const spy = jest.spyOn(jobSvc, 'getJob');

		const rtn = await controller.get(job._id);

		expect(rtn.toObject()).toEqual(job.toObject());
		expect(spy).toHaveBeenCalledTimes(1);

	});
});
