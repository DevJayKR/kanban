import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { SignUpDto } from './dtos/sign-up.dto';
import { SignInDto } from 'src/controllers/dtos/sign-in.dto';
import { UserEntity } from 'src/entities/user.entity';
import { Serializer } from 'src/controllers/decorators/serializer.decorator';
import { LocalGuard } from './guards/local.guard';
import { RtGuard } from './guards/rt.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { AtGuard } from './guards/at.guard';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('/signup')
	@Serializer(UserEntity)
	async signUp(@Body() dto: SignUpDto) {
		const { username, password } = dto;

		return await this.authService.signUp(username, password);
	}

	@Post('/signin')
	@UseGuards(LocalGuard)
	async signIn(@Body() dto: SignInDto) {
		const { username } = dto;

		return await this.authService.signIn(username);
	}

	@Post('/signout')
	@UseGuards(AtGuard)
	@HttpCode(HttpStatus.NO_CONTENT)
	async signOut(@CurrentUser() user: UserEntity) {
		return await this.authService.signOut(user);
	}

	@Post('refresh')
	@UseGuards(RtGuard)
	refresh(@CurrentUser() user: UserEntity) {
		return this.authService.refesh(user);
	}
}
