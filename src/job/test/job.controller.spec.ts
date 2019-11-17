import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { execFile } from 'child_process';
import { FileModule } from '../../file';
import { Job } from '../../job';
import { JobController } from '../job.controller';
import { JobService } from '../job.service';
import { JobSchema } from './../schemas/job.schema';

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
		job = await jobSvc.save(job);
		job.child = execFile('ls');
		jest.spyOn(jobSvc, 'startNew').mockImplementation(() => job);
		jest.spyOn(jobSvc, 'startListeners').mockImplementation(() => {});

		controller.startNew(job);
		expect(jobSvc.startNew).toHaveBeenCalledTimes(1);
		expect(jobSvc.startListeners).toHaveBeenCalledTimes(1);
	});
});
