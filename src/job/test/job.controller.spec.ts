import { JobSchema } from './../schemas/job.schema';
import { Model, Document as mDocument } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { JobController } from '../job.controller';
import { JobService } from '../job.service';
import { FileModule } from '../../file';
import { execFile } from 'child_process';
import { Job } from '../../job';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';

describe('Job Controller', () => {
	let controller: JobController;
	let jobSvc: JobService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
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
