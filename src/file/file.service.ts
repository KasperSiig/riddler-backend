import { Injectable } from '@nestjs/common';
import { appendFile, copy as fsCopy, readFile, existsSync } from 'fs-extra';
import { FileNotFoundException } from '../exceptions';

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

	/**
	 * Reads a file
	 *
	 * @param src File to read
	 */
	read(src: string): Promise<Buffer> {
		return readFile(src);
	}

	/**
	 * Validates that files exist
	 * @param files Files to validate
	 */
	validateMany(files: string[]) {
		files.forEach(this.validateOne);
	}

	/**
	 * Validates that file exists
	 * @param file File to validate
	 */
	validateOne(file: string) {
		if (!existsSync(file)) throw new FileNotFoundException(file);
	}
}
