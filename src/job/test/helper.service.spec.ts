import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { FileModule } from '../../file';
import { HelperService } from '../helper.service';
import { JobDataService } from '../job-data.service';
import { JobSchema } from '../schemas/job.schema';

describe('HelperService', () => {
	let service: HelperService;

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
			providers: [HelperService, JobDataService],
		}).compile();

		service = module.get<HelperService>(HelperService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
