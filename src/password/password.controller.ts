import { Body, Controller, Post } from '@nestjs/common';
import { PasswordService } from './password.service';

@Controller('passwords')
export class PasswordController {
	constructor(private passwordService: PasswordService) {}

	@Post()
	guessPasswords(@Body() passwds: string[]): Promise<object[]> {
		return this.passwordService.execMany(passwds);
	}
}
