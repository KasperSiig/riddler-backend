import { Injectable } from '@nestjs/common';
import { copy as fsCopy, appendFile } from 'fs-extra';

@Injectable()
export class FileService {
	/**
	 * Copies a given file to a given destination
	 */
	copy(src: string, dest: string): Promise<void> {
		return fsCopy(src, dest);
	}

	write(dest: string, data: string) {
		return appendFile(dest, data);
	}
}
