import { Module } from '@nestjs/common';
import { JobModule } from './job';
import { FileModule } from './file';
import { MongooseModule } from '@nestjs/mongoose';
import { StatsModule } from './stats/stats.module';
import { ExceptionsModule } from './exceptions/exceptions.module';

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
		ExceptionsModule,
	],
})
export class AppModule {}
