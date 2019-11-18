import { Injectable } from '@nestjs/common';
import { appendFile, copy as fsCopy } from 'fs-extra';

@Injectable()
export class FileService {
	/**
	 * Copies a given file to a given destination
	 * @param src Where to copy from
	 * @param dest Where to copy to
	 */
	copy(src: string, dest: string): Promise<void> {
		return fsCopy(src, dest);
	}

	/**
	 *
	 * @param dest Where to write to
	 * @param data What to write
	 */
	write(dest: string, data: string): Promise<void> {
		return appendFile(dest, data);
	}
}
