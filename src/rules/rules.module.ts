import { Module } from '@nestjs/common';
import { FileModule } from '../file';
import { RulesController } from './rules.controller';
import { RulesService } from './rules.service';

@Module({
	imports: [FileModule],
	providers: [RulesService],
	controllers: [RulesController],
	exports: [RulesService],
})
export class RulesModule {}
