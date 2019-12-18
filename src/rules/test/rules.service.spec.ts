import { Test, TestingModule } from '@nestjs/testing';
import { writeFileSync } from 'fs-extra';
import { FileModule } from '../../file';
import { RulesService } from '../rules.service';

describe('RulesService', () => {
	let module: TestingModule;
	let service: RulesService;

	let envBak: string;
	let johnBak: string;

	beforeAll(() => {
		envBak = process.env.JTR_ROOT;
		johnBak = process.env.JTR_EXECUTABLE;
		process.env.JTR_ROOT = '/tmp/';
		process.env.JTR_EXECUTABLE = '/tmp/john';
	});

	afterAll(() => {
		process.env.JTR_ROOT = envBak;
		process.env.JTR_EXECUTABLE = johnBak;
	});

	beforeEach(async () => {
		module = await Test.createTestingModule({
			imports: [FileModule],
			providers: [RulesService],
		}).compile();

		service = module.get<RulesService>(RulesService);
	});

	afterEach(async () => {
		await module.close();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should return an array of all existing rules', async () => {
		const expected = ['None', 'Single', 'Jumbo', 'Split'];
		writeFileSync(
			process.env.JTR_EXECUTABLE + '.conf',
			expected.map(r => '[List.Rules:' + r + ']').join('\n'),
		);
		const result = await service.getAll();
		expect(result).toEqual(expected);
	});
});
