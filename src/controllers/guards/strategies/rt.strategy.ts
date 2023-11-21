import { UserService } from 'src/services/user.service';
import { User } from '@prisma/client';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import jwtConfiguration from 'src/configs/jwt.configuration';
import { ConfigType } from '@nestjs/config';
import { TokenPayload } from 'src/helpers/token-payload.interface';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'refresh-token') {
	constructor(
		@Inject(jwtConfiguration.KEY)
		private readonly config: ConfigType<typeof jwtConfiguration>,
		private readonly userService: UserService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: config.refresh.secretKey,
			passReqToCallback: true,
		});
	}

	async validate(req: Request, payload: TokenPayload) {
		const isMatched = this.getRequestToken(req) == (await this.getRefreshToken(payload));

		if (isMatched) {
			return { id: payload.id, username: payload.username } as User;
		}

		await this.userService.update({ id: payload.id }, { refreshToken: null });
		throw new BadRequestException('유효하지 않은 토큰입니다.');
	}

	getRequestToken(req: Request) {
		return req.headers['authorization'].split(' ')[1];
	}

	async getRefreshToken(payload: TokenPayload) {
		const { refreshToken } = await this.userService.findOne({ id: payload.id });

		if (!refreshToken) {
			throw new BadRequestException('유효하지 않은 토큰입니다.');
		}

		return refreshToken;
	}
}
