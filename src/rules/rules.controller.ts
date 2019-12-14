import { Controller, Get } from '@nestjs/common';
import { RulesService } from './rules.service';

@Controller('rules')
export class RulesController {
	constructor(private rulesSvc: RulesService) {}

	/**
	 * Gets all rules
	 */
	@Get('')
	getAll(): Promise<string[]> {
		return this.rulesSvc.getAll();
	}
}
