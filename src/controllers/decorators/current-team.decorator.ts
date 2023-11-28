import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const CurrentTeam = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest();
	return request.team;
});
