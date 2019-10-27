import { Module, OnModuleInit } from '@nestjs/common';
import { FileModule } from './file';
import { ParserModule } from './parser';
import { PasswordModule } from './password';

@Module({
	imports: [FileModule, ParserModule, PasswordModule],
})
export class AppModule implements OnModuleInit {
	constructor() {}

	onModuleInit() {}
}
