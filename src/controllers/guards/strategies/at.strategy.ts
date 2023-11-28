import { User } from '@prisma/client';
import { Inject, Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import jwtConfiguration from 'src/configs/jwt.configuration';
import { ConfigType } from '@nestjs/config';
import { TokenPayload } from 'src/utils/token-payload.interface';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'access-token') {
	constructor(
		@Inject(jwtConfiguration.KEY)
		private readonly config: ConfigType<typeof jwtConfiguration>,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: config.access.secretKey,
		});
	}

	async validate(payload: TokenPayload) {
		return { id: payload.id, username: payload.username } as User;
	}
}
