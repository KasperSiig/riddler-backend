import { Module } from '@nestjs/common';
import { RulesService } from './rules.service';
import { FileModule } from '../file';
import { RulesController } from './rules.controller';

@Module({
	imports: [FileModule],
	providers: [RulesService],
	controllers: [RulesController],
	exports: [RulesService],
})
export class RulesModule {}
