import { BadRequestException, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AtGuard extends AuthGuard('access-token') {
	handleRequest(err: any, user: any, info: any, context: ExecutionContext, status: number) {
		if (info) {
			if (info.message == 'No auth token') {
				throw new BadRequestException('토큰이 없습니다.');
			}

			if (info instanceof Array && info[0].message == 'No auth token') {
				throw new BadRequestException('토큰이 없습니다.');
			}
		}

		if (info instanceof TokenExpiredError) {
			throw new UnauthorizedException('만료된 토큰입니다.');
		}

		if (info instanceof JsonWebTokenError) {
			throw new UnauthorizedException('유효하지 않은 토큰입니다.');
		}

		return super.handleRequest(err, user, info, context, status);
	}
}
