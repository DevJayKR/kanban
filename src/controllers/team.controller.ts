import { Body, Controller, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { TeamService } from '@services/team.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '@prisma/client';
import { CreateTeamDto } from './dtos/create-team.dto';
import { AtGuard } from './guards/at.guard';
import { TeamLeaderGuard } from './guards/team-leader.guard';
import { InviteTeamDto } from './dtos/invite-team.dto';

@Controller('team')
export class TeamController {
	constructor(private readonly teamService: TeamService) {}

	@Post()
	@UseGuards(AtGuard)
	async create(@CurrentUser() user: User, @Body() dto: CreateTeamDto) {
		const { name } = dto;
		const { id } = user;

		return await this.teamService.create(id, name);
	}

	@Post('/:teamId/invite')
	@UseGuards(AtGuard, TeamLeaderGuard)
	async invite(@Param('teamId', ParseIntPipe) teamId: number, @Body() dto: InviteTeamDto) {
		const { inviteeId } = dto;

		return await this.teamService.invite(teamId, inviteeId);
	}

	@Patch('/accept/:inviteId')
	@UseGuards(AtGuard)
	async acceptInvite(@CurrentUser() user: User, @Param('inviteId', ParseIntPipe) inviteId: number) {
		return await this.teamService.accept(inviteId, user.id);
	}
}
