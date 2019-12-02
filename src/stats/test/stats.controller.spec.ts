import { Test, TestingModule } from '@nestjs/testing';
import { StatsController } from '../stats.controller';
import { StatsService } from '../stats.service';
import { of } from 'rxjs';
import { JobModule, JobSchema } from '../../job';
import { MongooseModule } from '@nestjs/mongoose';
import { FileModule } from '../../file';

describe('Stats Controller', () => {
	let controller: StatsController;
	let statsSvc: StatsService;
	let module: TestingModule;

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
			providers: [StatsService],
		}).compile();

		controller = module.get<StatsController>(StatsController);
		statsSvc = module.get<StatsService>(StatsService);
	});

	afterEach(() => {
		module.close();
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	it('should call service for admins cracked', async () => {
		const stats = { total: 0, cracked: 0, percentage: 0 };
		const spy = jest
			.spyOn(statsSvc, 'getAdminsCracked')
			// tslint:disable-next-line: variable-name
			.mockImplementation(_id => {
				return of(stats).toPromise();
			});

		const statsRtn = await controller.getAdminsCracked('id');
		expect(spy).toHaveBeenCalledTimes(1);
		expect(statsRtn).toBe(stats);
	});

	it('should call service for users cracked', async () => {
		const stats = { total: 0, cracked: 0, percentage: 0 };
		const spy = jest
			.spyOn(statsSvc, 'getAllCracked')
			// tslint:disable-next-line: variable-name
			.mockImplementation(_id => {
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
});
