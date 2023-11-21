import { TokenPayload } from './../helpers/token-payload.interface';
import { Injectable } from '@nestjs/common';
import { JwtHelper } from 'src/helpers/jwt.helper';
import { UserService } from 'src/services/user.service';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly jwtHelper: JwtHelper,
	) {}

	async signUp(username: string, password: string) {
		return await this.userService.create(username, password);
	}

	async signIn(username: string) {
		const user = await this.userService.findOne({ username });

		const payload: TokenPayload = {
			id: user.id,
			username: user.username,
		};

		return {
			accessToken: this.jwtHelper.generateAccessToken(payload),
			refreshToken: this.jwtHelper.generateRefreshToken(payload),
		};
	}
}
