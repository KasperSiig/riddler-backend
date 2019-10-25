import { Injectable } from '@nestjs/common';

@Injectable()
export class ParserService {
	parseNtds(input: string) {
		const lines = input.split('\n');
		const hashes = lines.map(l => l.split(':')[3]);
		return hashes;
	}
}
