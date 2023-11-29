import { Body, Controller, Param, ParseIntPipe, Post, UseGuards, Get, Patch } from '@nestjs/common';
import { CreateColumnDto } from './dtos/create-column.dto';
import { AtGuard } from './guards/at.guard';
import { BoardService } from 'src/services/board.service';
import { TeamMemberGuard } from './guards/team-member.guard';
import { UpdateColumnOrderDto } from './dtos/update-column-order.dto';
import { CreateTicketDto } from './dtos/create-ticket.dto';
import { ParseColumnIdPipe } from './pipes/parse-column-id.pipe';

@Controller('board')
export class BoardController {
	constructor(private readonly boardService: BoardService) {}

	@Post('/:teamId/column')
	@UseGuards(AtGuard, TeamMemberGuard)
	async createColumn(@Param('teamId', ParseIntPipe) teamId: number, @Body() dto: CreateColumnDto) {
		const { name } = dto;

		return await this.boardService.createColumn(teamId, name);
	}

	@Get('/:teamId')
	@UseGuards(AtGuard, TeamMemberGuard)
	async findColumns(@Param('teamId', ParseIntPipe) teamId: number) {
		return await this.boardService.findColumns(teamId);
	}

	@Patch('/:teamId/column/order')
	@UseGuards(AtGuard, TeamMemberGuard)
	async changeColumnOrder(
		@Param('teamId', ParseIntPipe) teamId: number,
		@Body(ParseColumnIdPipe) dto: UpdateColumnOrderDto,
	) {
		const { column, toBe } = dto;

		return await this.boardService.changeColumnOrder(column, toBe, teamId);
	}

	@Post('/:teamId/ticket')
	@UseGuards(AtGuard, TeamMemberGuard)
	async createTicket(@Body(ParseColumnIdPipe) dto: CreateTicketDto) {
		const { column, title, tag } = dto;

		return await this.boardService.createTicket(column, title, tag);
	}
}
