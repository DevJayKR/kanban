import { TokenPayload } from '../utils/token-payload.interface';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from '../services/user.service';
import { JwtService } from './jwt.service';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService,
	) {}

	async signUp(username: string, password: string) {
		return await this.userService.create(username, password);
	}

	async signIn(username: string) {
		const user = await this.userService.findOne({ username });
		const payload = this.createPayload(user);

		const accessToken = this.jwtService.generateAccessToken(payload);
		const refreshToken = this.jwtService.generateRefreshToken(payload);

		await this.updateUserRefreshToken(user, refreshToken);

		return {
			accessToken,
			refreshToken,
		};
	}

	async refesh(user: User) {
		const payload = this.createPayload(user);
		return this.jwtService.generateAccessToken(payload);
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
