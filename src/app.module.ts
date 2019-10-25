import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileModule, FileService } from './file';
import { ParserModule } from './parser/parser.module';
import { ParserService } from './parser/parser.service';

@Module({
	imports: [FileModule, ParserModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule implements OnModuleInit {
	constructor() {}

	onModuleInit() {}
}
