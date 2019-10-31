import { Module } from '@nestjs/common';
import { FileModule } from './file';
import { PasswordModule, PasswordService } from './password';
import { PasswordController } from './password/password.controller';

@Module({
	imports: [FileModule, PasswordModule],
	controllers: [PasswordController],
	providers: [PasswordService],
})
export class AppModule {}
