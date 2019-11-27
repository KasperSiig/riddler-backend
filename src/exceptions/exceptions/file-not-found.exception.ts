import { HttpException, HttpStatus } from '@nestjs/common';

export class FileNotFoundException extends HttpException {
	constructor(file: string) {
		super('File ' + file + ' Not Found', HttpStatus.NOT_FOUND);
	}
}
