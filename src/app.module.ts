import { Module } from '@nestjs/common';
import { JobModule } from './job';
import { FileModule } from './file';
import { MongooseModule } from '@nestjs/mongoose';
import { StatsModule } from './stats/stats.module';

@Module({
	imports: [
		JobModule,
		FileModule,
		MongooseModule.forRoot(process.env.MONGO_CONN_STRING, {
			useNewUrlParser: true,
			useFindAndModify: false,
			useUnifiedTopology: true,
		}),
		StatsModule,
	],
})
export class AppModule {}
