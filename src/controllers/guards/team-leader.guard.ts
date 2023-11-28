import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { TeamService } from 'src/services/team.service';

@Injectable()
export class TeamLeaderGuard implements CanActivate {
	constructor(private readonly teamService: TeamService) {}

	async canActivate(context: ExecutionContext) {
		const req = context.switchToHttp().getRequest();
		const teamId = parseInt(req.params.teamId);
		const user = req.user;
		const validate = await this.teamService.isTeamLeader(teamId, user.id);

		return validate;
	}
}
