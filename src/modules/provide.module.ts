import { Logger, Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { TransformInterceptor } from 'src/controllers/interceptors/transform.interceptor';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';
import { ValidationExceptionFilter } from 'src/filters/validation-exception.filter';
import { validationExceptionFactory } from 'src/utils/validation-exception.factory';

@Module({
	providers: [
		Logger,
		{
			provide: APP_PIPE,
			useValue: new ValidationPipe({
				transform: true,
				whitelist: true,
				exceptionFactory: validationExceptionFactory,
			}),
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: TransformInterceptor,
		},
		{
			provide: APP_FILTER,
			useClass: HttpExceptionFilter,
		},
		{
			provide: APP_FILTER,
			useClass: ValidationExceptionFilter,
		},
	],
})
export class ProvideModule {}
