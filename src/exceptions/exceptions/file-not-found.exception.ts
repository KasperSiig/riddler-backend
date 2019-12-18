import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Informs requester that a given file could not be found
 */
export class FileNotFoundException extends HttpException {
	constructor(file: string) {
		super('File ' + file + ' Not Found', HttpStatus.NOT_FOUND);
	}
}
