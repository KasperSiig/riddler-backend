import { Test, TestingModule } from '@nestjs/testing';
import { JobController } from '../job.controller';
import { JobService } from '../job.service';
import { job } from './helpers/objects';

describe('Job Controller', () => {
	let controller: JobController;
	let jobSvc: JobService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [JobService],
			controllers: [JobController],
		}).compile();

		controller = module.get<JobController>(JobController);
		jobSvc = module.get<JobService>(JobService);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	it('should call service to start job', () => {
		jest.spyOn(jobSvc, 'startNew');

		controller.startNew(job);
		expect(jobSvc.startNew).toHaveBeenCalledTimes(1);
	});
});
