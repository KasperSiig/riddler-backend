import { Injectable } from '@nestjs/common';
import { readFileSync as readFileFS } from 'fs-extra';

@Injectable()
export class FileService {
	readFile(file: string): string {
		return readFileFS(file).toString();
	}
}
