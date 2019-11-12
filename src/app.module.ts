import { Module } from '@nestjs/common';
import { JobModule } from './job';

@Module({
	imports: [JobModule],
})
export class AppModule {}
