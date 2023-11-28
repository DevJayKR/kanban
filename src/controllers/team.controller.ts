import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { TeamService } from 'src/services/team.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '@prisma/client';
import { CreateTeamDto } from './dtos/create-team.dto';
import { AtGuard } from './guards/at.guard';
import { InviteTeamDto } from './dtos/invite-team.dto';
import { CreateColumnDto } from './dtos/create-column.dto';
import { UpdateColumnOrderDto } from './dtos/update-column-order.dto';

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
		const invitorId = user.id;
		const { teamId, inviteeId } = dto;

		return await this.teamService.invite(teamId, inviteeId, invitorId);
	}

	@Patch('invite/:inviteId')
	@UseGuards(AtGuard)
	async accept(@CurrentUser() user: User, @Param('inviteId', ParseIntPipe) inviteId: number) {
		const inviteeId = user.id;

		return await this.teamService.accept(inviteId, inviteeId);
	}

	@Post('column')
	@UseGuards(AtGuard)
	async createColumn(@CurrentUser() user: User, @Body() dto: CreateColumnDto) {
		const { id } = user;
		const { teamId, name } = dto;

		return await this.teamService.createColumn(name, teamId, id);
	}

	@Patch('board/:teamId/column/order')
	@UseGuards(AtGuard)
	async changeColumnOrder(
		@CurrentUser() user: User,
		@Body() dto: UpdateColumnOrderDto,
		@Param('teamId') teamId: number,
	) {
		const userId = user.id;
		const { columnId, toBe } = dto;

		return await this.teamService.changeColumnOrder(columnId, toBe, teamId, userId);
	}

	@Get('board/:teamId')
	@UseGuards(AtGuard)
	async findBoard(@CurrentUser() user: User, @Param('teamId') teamId: number) {
		const { id } = user;

		return await this.teamService.findColumns(teamId, id);
	}
}
