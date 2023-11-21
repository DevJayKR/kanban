import { UserService } from 'src/services/user.service';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class LocalGuard implements CanActivate {
	constructor(private readonly userService: UserService) {}

	async canActivate(context: ExecutionContext) {
		const req = context.switchToHttp().getRequest();
		const { username, password } = req.body;

		return await this.validate(username, password);
	}

	async validate(username: string, password: string) {
		const user = await this.userService.validateCredentials(username, password);

		if (user) return true;
	}
}
