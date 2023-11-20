import { ArgumentsHost, Catch, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Catch(PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
	constructor(private readonly logger: Logger) {
		super();
	}
	catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
		this.logger.log(exception);
		super.catch(exception, host);
	}
}
