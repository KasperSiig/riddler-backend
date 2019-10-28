import { ParserModule } from '../parser.module';

describe('ParserModule', () => {
	let parserModule: ParserModule;

	beforeEach(() => {
		parserModule = new ParserModule();
	});

	it('should be constructed', () => {
		expect(parserModule).toBeTruthy();
	});
});
