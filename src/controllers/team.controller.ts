import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { TeamService } from 'src/services/team.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '@prisma/client';
import { CreateTeamDto } from './dtos/create-team.dto';
import { AtGuard } from './guards/at.guard';

@Controller('team')
export class TeamController {
	constructor(private readonly teamService: TeamService) {}

	@Post()
	@UseGuards(AtGuard)
	async create(@CurrentUser() user: User, @Body() dto: CreateTeamDto) {
		const { name } = dto;

		return await this.teamService.create(user, name);
	}
}
