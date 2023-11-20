import { Injectable } from '@nestjs/common';
import { UserService } from 'src/services/user.service';

@Injectable()
export class AuthService {
	constructor(private readonly userService: UserService) {}

	async signUp(username: string, password: string) {
		return await this.userService.create(username, password);
	}

	async signIn(username: string, password: string) {
		return await this.userService.validateCredentials(username, password);
	}
}
