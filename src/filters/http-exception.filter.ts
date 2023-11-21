import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	name = 'HttpExceptionFilter';
	constructor(private readonly logger: Logger) {}

	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();
		const status = exception.getStatus();
		const message = exception.message;

		this.logger.debug(request.url, this.name);
		this.logger.debug(`${status} :: ${message}`, this.name);

		response.status(status).json({
			statusCode: status,
			message,
			timestamp: new Date().toISOString(),
			path: request.url,
		});
	}
}
