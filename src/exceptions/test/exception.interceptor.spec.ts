import { Test, TestingModule } from '@nestjs/testing';
import { ExceptionInterceptor } from '../exception.interceptor';
import { ExecutionContext } from '@nestjs/common';
import { of, Observable } from 'rxjs';
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

	it('should be defined', () => {
		expect(interceptor).toBeTruthy();
	});

	it('should throw an error', () => {
		const handle = { handle: jest.fn(() => of(new FileNotFoundException('test'))) };
		const result = interceptor.intercept({} as ExecutionContext, handle) as Observable<any>;
		result.subscribe(r => {
			expect(r.toString()).toBe('Error: File test Not Found');
		});
		expect(handle.handle).toHaveBeenCalled();
	});
});
