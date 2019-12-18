import { Injectable } from '@nestjs/common';
import {
	appendFile,
	copy as fsCopy,
	existsSync,
	mkdirpSync,
	readFile,
} from 'fs-extra';
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
	append(dest: string, data: string): Promise<void> {
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
	 * Validates that file exists
	 * @param file File to validate
	 */
	validateOne(file: string): void {
		if (!existsSync(file)) throw new FileNotFoundException(file);
	}

	/**
	 * Creates a directory
	 * @param dir Directory to create
	 */
	mkdirSync(dir: string): void {
		if (!existsSync(dir)) {
			mkdirpSync(dir);
		}
	}
}
