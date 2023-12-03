import { ArgumentsHost, Catch, Logger, ExceptionFilter } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
	constructor(private readonly logger: Logger) {}

	catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();
		const message = exception.meta.cause;
		const prismaCode = exception.code;

		response.status(400).json({
			message,
			errorCode: prismaCode,
			timestamp: new Date().toISOString(),
			path: request.url,
		});
	}
}
