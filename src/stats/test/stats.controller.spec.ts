import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { FileModule } from '../../file';
import { JobModule, JobSchema } from '../../job';
import { HelperService } from '../helper.service';
import { StatsController } from '../stats.controller';
import { StatsService } from '../stats.service';

describe('Stats Controller', () => {
	let module: TestingModule;
	let controller: StatsController;

	let statsSvc: StatsService;

	beforeEach(async () => {
		module = await Test.createTestingModule({
			imports: [
				FileModule,
				JobModule,
				MongooseModule.forRoot(process.env.MONGO_URL, {
					useNewUrlParser: true,
					useUnifiedTopology: true,
					useFindAndModify: false,
				}),
				MongooseModule.forFeature([{ name: 'Job', schema: JobSchema }]),
			],
			controllers: [StatsController],
			providers: [StatsService, HelperService],
		}).compile();

		controller = module.get<StatsController>(StatsController);
		statsSvc = module.get<StatsService>(StatsService);
	});

	afterEach(async () => {
		await module.close();
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	it('should call service for admins cracked', async () => {
		const stats = { total: 0, cracked: 0, percentage: 0 };
		const spy = jest
			.spyOn(statsSvc, 'getAdminsCracked')
			.mockImplementation(id => {
				return of(stats).toPromise();
			});

		const statsRtn = await controller.getAdminsCracked('id');
		expect(spy).toHaveBeenCalledTimes(1);
		expect(statsRtn).toBe(stats);
	});

	it('should call service for users cracked', async () => {
		const stats = { total: 0, cracked: 0, percentage: 0 };
		const spy = jest.spyOn(statsSvc, 'getAllCracked').mockImplementation(id => {
			return of(stats).toPromise();
		});

		const statsRtn = await controller.getAllCracked('id');
		expect(spy).toHaveBeenCalledTimes(1);
		expect(statsRtn).toBe(stats);
	});

	it('should call service to export', () => {
		const spy = jest
			.spyOn(statsSvc, 'exportStats')
			.mockImplementation(id => of('this, is, a, test').toPromise());
		controller.exportStats('test');
		expect(spy).toHaveBeenCalledTimes(1);
	});

	it('should call service to get frequency', () => {
		const spy = jest
			.spyOn(statsSvc, 'getFreqCount')
			.mockImplementation((): any => {});
		controller.getFreq('Test123', '1');
		expect(spy).toHaveBeenCalledTimes(1);
	});

	it('should call service to get top 10 stats', () => {
		const spy = jest
			.spyOn(statsSvc, 'getTopTenStats')
			.mockImplementation((): any => {});
		controller.getTopTenStats('id');
		expect(spy).toHaveBeenCalledTimes(1);
	});
});
