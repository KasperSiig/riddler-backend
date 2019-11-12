import { Test, TestingModule } from '@nestjs/testing';
import { JobController } from '../job.controller';
import { JobService } from '../job.service';

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
		const job = { file: '../test.txt' };
		const result = 'ok';

		jest.spyOn(jobSvc, 'startNew').mockImplementation(() => {
			return result;
		});

		const response = controller.startNew(job);

		expect(jobSvc.startNew).toHaveBeenCalledTimes(1);
		expect(response).toBe(result);
	});
});
