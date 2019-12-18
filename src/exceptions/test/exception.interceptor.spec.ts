import { ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Observable, of } from 'rxjs';
import { ExceptionInterceptor } from '../exception.interceptor';
import { FileNotFoundException } from '../exceptions/file-not-found.exception';

describe('Exception Interceptor', () => {
	let module: TestingModule;
	let interceptor: ExceptionInterceptor;

	beforeEach(async () => {
		module = await Test.createTestingModule({
			providers: [ExceptionInterceptor],
		}).compile();

		interceptor = module.get<ExceptionInterceptor>(ExceptionInterceptor);
	});

	afterEach(async () => {
		await module.close();
	});

	it('should be defined', () => {
		expect(interceptor).toBeTruthy();
	});

	it('should throw an error', () => {
		const next = {
			handle: jest.fn(() => of(new FileNotFoundException('test'))),
		};

		const expected = next.handle;
		const result = interceptor.intercept(
			{} as ExecutionContext,
			next,
		) as Observable<any>;

		result.subscribe(r => {
			expect(r.toString()).toBe('Error: File test Not Found');
		});
		expect(expected).toHaveBeenCalled();
	});
});
