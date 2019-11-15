import { Test, TestingModule } from '@nestjs/testing';
import { JobController } from '../job.controller';
import { JobService } from '../job.service';
import { FileModule } from '../../file';
import { execFile } from 'child_process';

describe('Job Controller', () => {
	let controller: JobController;
	let jobSvc: JobService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [FileModule],
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
		const job = { file: 'src/job/test/files/passwd.txt' };
		jest
			.spyOn(jobSvc, 'startNew')
			.mockImplementation(() => ({ ...job, child: execFile('ls') }));
		jest.spyOn(jobSvc, 'startListeners').mockImplementation(() => {});

		controller.startNew(job);
		expect(jobSvc.startNew).toHaveBeenCalledTimes(1);
		expect(jobSvc.startListeners).toHaveBeenCalledTimes(1);
	});
});
