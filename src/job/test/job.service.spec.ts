import { Test, TestingModule } from '@nestjs/testing';
import { JobService } from '../job.service';
import * as child_process from 'child_process';
import { job } from './helpers/objects';

describe('JobService', () => {
	let service: JobService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [JobService],
		}).compile();

		service = module.get<JobService>(JobService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should spawn process', () => {
		jest.mock('child_process', () => ({
			spawn: () => {},
		}));
		const spy = jest.spyOn(child_process, 'spawn');

		service.startNew(job);
		expect(spy).toHaveBeenCalled();
	});
});
