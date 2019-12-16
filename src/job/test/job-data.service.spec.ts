import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { JobDataService } from '../job-data.service';
import { JobSchema } from '../schemas/job.schema';

describe('JobDataService', () => {
	let service: JobDataService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				MongooseModule.forRoot(process.env.MONGO_URL, {
					useNewUrlParser: true,
					useUnifiedTopology: true,
					useFindAndModify: false,
				}),
				MongooseModule.forFeature([{ name: 'Job', schema: JobSchema }]),
			],
			providers: [JobDataService],
		}).compile();

		service = module.get<JobDataService>(JobDataService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
