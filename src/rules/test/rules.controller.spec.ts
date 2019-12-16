import { Test, TestingModule } from '@nestjs/testing';
import { FileModule } from '../../file';
import { RulesController } from '../rules.controller';
import { RulesService } from '../rules.service';

describe('Rules Controller', () => {
	let module: TestingModule;
	let controller: RulesController;

	let rulesSvc: RulesService;

	beforeEach(async () => {
		module = await Test.createTestingModule({
			imports: [FileModule],
			controllers: [RulesController],
			providers: [RulesService],
		}).compile();

		controller = module.get<RulesController>(RulesController);
		rulesSvc = module.get<RulesService>(RulesService);
	});

	afterEach(async () => {
		await module.close();
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	it('should call service to get all rules', () => {
		const spy = jest
			.spyOn(rulesSvc, 'getAll')
			.mockImplementation((): any => {});
		controller.getAll();

		expect(spy).toHaveBeenCalledTimes(1);
	});
});
