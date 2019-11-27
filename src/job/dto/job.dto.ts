import { IsDefined, IsString, Matches } from 'class-validator';

export class JobDTO {
	@IsDefined()
	@IsString()
	name: string;

	@IsDefined()
	@IsString()
	@Matches(/^[a-zA-Z0-9\/\.]+$/)
	file: string;
}
