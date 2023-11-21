import { Body, Controller, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { TeamService } from 'src/services/team.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '@prisma/client';
import { CreateTeamDto } from './dtos/create-team.dto';
import { AtGuard } from './guards/at.guard';
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

	@Post('invite')
	@UseGuards(AtGuard)
	async invite(@CurrentUser() user: User, @Body() dto: InviteTeamDto) {
		const { teamId, inviteeId } = dto;

		return await this.teamService.invite(teamId, inviteeId);
	}

	@Patch('invite/:inviteId')
	@UseGuards(AtGuard)
	async accept(@CurrentUser() user: User, @Param('inviteId', ParseIntPipe) inviteId: number) {
		const inviteeId = user.id;

		return await this.teamService.accept(inviteId, inviteeId);
	}
}
