import { Module, OnModuleInit } from '@nestjs/common';
import { FileModule } from './file';
import { PasswordModule } from './password';

@Module({
	imports: [FileModule, PasswordModule],
})
export class AppModule {}
