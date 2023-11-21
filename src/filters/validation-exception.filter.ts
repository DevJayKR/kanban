import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import { ValidationException } from 'src/utils/validation-exception';

@Catch(ValidationException)
export class ValidationExceptionFilter implements ExceptionFilter {
	catch(exception: ValidationException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const request = ctx.getRequest<Request>();
		const response = ctx.getResponse<Response>();
		const status = exception.getStatus();
		const name = exception.name;
		const message = exception.getResponse();

		response.status(status).json({
			success: false,
			statusCode: status,
			name,
			message,
			timestamp: new Date().toISOString(),
			path: request.url,
		});
	}
}
