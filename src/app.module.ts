import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileModule } from './file';
import { JobModule } from './job';
import { RulesModule } from './rules';
import { StatsModule } from './stats/stats.module';
import { WordlistModule } from './wordlist';

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
		WordlistModule,
		RulesModule,
	],
})
export class AppModule {}
