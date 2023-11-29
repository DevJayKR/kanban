import { UserService } from 'src/services/user.service';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { SignInDto } from '../dtos/sign-in.dto';
import { validateOrReject } from 'class-validator';
import { validationExceptionFactory } from 'src/utils/validation-exception.factory';

@Injectable()
export class LocalGuard implements CanActivate {
	constructor(private readonly userService: UserService) {}

	async canActivate(context: ExecutionContext) {
		const req = context.switchToHttp().getRequest();
		const { username, password } = req.body;

		return await this.validate(username, password);
	}

	async validate(username: string, password: string) {
		const dto = plainToClass(SignInDto, { username, password });

		await validateOrReject(dto).catch((e) => {
			throw validationExceptionFactory(e);
		});

		const user = await this.userService.validateCredentials(username, password);

		if (user) return true;
	}
}
