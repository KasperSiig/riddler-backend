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

	it('should get all finished jobs', async () => {
		let job = { file: 'src/job/test/files/passwd.txt' } as Job;
		job = await jobSvc.update(job);

		controller.getByStatus(STATUS.FINISHED);
	});
});
