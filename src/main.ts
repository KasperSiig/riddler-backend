import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExceptionInterceptor } from './exceptions';

async function bootstrap() {
	const variables = ['JTR_ROOT', 'JTR_EXECUTABLE', 'MONGO_CONN_STRING'];
	let fail = false;
	variables.forEach(v => {
		if (!process.env[v]) {
			console.error(
				'\x1b[31m',
				'Following environment variable does not exist:',
				v,
			);
			fail = true;
		}
	});
	if (fail) return;
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe());
	app.useGlobalInterceptors(new ExceptionInterceptor());
	app.enableCors();
	await app.listen(3000);
}
bootstrap();
