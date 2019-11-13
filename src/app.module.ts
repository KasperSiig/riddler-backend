import { Module } from '@nestjs/common';
import { JobModule } from './job';
import { FileModule } from './file';

@Module({
	imports: [JobModule, FileModule],
})
export class AppModule {}
