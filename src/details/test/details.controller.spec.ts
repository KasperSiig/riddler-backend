import { Test, TestingModule } from '@nestjs/testing';
import { DetailsController } from '../details.controller';
import { DetailsService } from '../details.service';
import { execFile } from 'child_process';

describe('Details Controller', () => {
	let controller: DetailsController;
	let detailsSvc: DetailsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [DetailsController],
			providers: [DetailsService],
		}).compile();

		controller = module.get<DetailsController>(DetailsController);
		detailsSvc = module.get<DetailsService>(DetailsService);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	it('should call service to get details', () => {
		const spy = jest.spyOn(detailsSvc, 'getJobs').mockImplementation(() => {});

		controller.getJobs();
		expect(spy).toBeCalledTimes(1);
	});
});
