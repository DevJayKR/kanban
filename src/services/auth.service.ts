import { TokenPayload } from './../helpers/token-payload.interface';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
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
		const payload = this.createPayload(user);

		const accessToken = this.jwtHelper.generateAccessToken(payload);
		const refreshToken = this.jwtHelper.generateRefreshToken(payload);

		await this.updateUserRefreshToken(user, refreshToken);

		return {
			accessToken,
			refreshToken,
		};
	}

	async refesh(user: User) {
		const payload = this.createPayload(user);
		return this.jwtHelper.generateAccessToken(payload);
	}

	async signOut(user: User) {
		await this.updateUserRefreshToken(user, null);
	}

	private createPayload(user: User) {
		const payload: TokenPayload = {
			id: user.id,
			username: user.username,
		};

		return payload;
	}

	private async updateUserRefreshToken(user: User, refreshToken: string | null) {
		await this.userService.update({ id: user.id }, { refreshToken });
	}
}
