import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { SignUpDto } from './dtos/sign-up.dto';
import { SignInDto } from 'src/controllers/dtos/sign-in.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('/signup')
	async signUp(@Body() dto: SignUpDto) {
		const { username, password } = dto;

		return await this.authService.signUp(username, password);
	}

	@Post('/signin')
	async signIn(@Body() dto: SignInDto) {
		const { username, password } = dto;

		return await this.authService.signIn(username, password);
	}
}
