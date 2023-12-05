import { Inject, Injectable } from '@nestjs/common';
import { JwtService as Jwt, JwtVerifyOptions } from '@nestjs/jwt';
import { TokenPayload } from '@utils/token-payload.interface';
import jwtConfiguration from '@configs/jwt.configuration';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class JwtService {
	constructor(
		private readonly jwt: Jwt,
		@Inject(jwtConfiguration.KEY)
		private readonly config: ConfigType<typeof jwtConfiguration>,
	) {}

	generateAccessToken(payload: TokenPayload) {
		return this.jwt.sign(payload, {
			secret: this.config.access.secretKey,
			expiresIn: this.config.access.expirationTimeAsSecond,
		});
	}

	generateRefreshToken(payload: TokenPayload) {
		return this.jwt.sign(payload, {
			secret: this.config.refresh.secretKey,
			expiresIn: this.config.refresh.expirationTimeAsSecond,
		});
	}

	verify(token: string, options: JwtVerifyOptions) {
		return this.jwt.verify(token, options);
	}
}
