import { Body, Controller, Param, ParseIntPipe, Post, UseGuards, Get, Patch, Delete } from '@nestjs/common';
import { CreateColumnDto } from './dtos/create-column.dto';
import { AtGuard } from './guards/at.guard';
import { BoardService } from 'src/services/board.service';
import { TeamMemberGuard } from './guards/team-member.guard';
import { UpdateColumnOrderDto } from './dtos/update-column-order.dto';
import { CreateTicketDto } from './dtos/create-ticket.dto';
import { ParseColumnIdPipe } from './pipes/parse-column-id.pipe';
import { ParseTicketIdPipe } from './pipes/parse.ticket-id.pipe';
import { UpdateTicketOrderDto } from './dtos/update-ticket-order.dto';
import { UpdateColumnDto } from './dtos/update-column.dto';
import { TeamLeaderGuard } from './guards/team-leader.guard';
import { DeleteColumnDto } from './dtos/delete-column.dto';
import { ColumnWithTickets } from 'src/utils/column-with-tickets.type';

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

	@Patch('/:teamId/column')
	@UseGuards(AtGuard, TeamMemberGuard)
	async updateColumn(@Body(ParseColumnIdPipe) dto: UpdateColumnDto) {
		const { column, name } = dto;

		return await this.boardService.updateColumn(column, name);
	}

	@Delete('/:teamId/column')
	@UseGuards(AtGuard, TeamLeaderGuard)
	async deleteColumn(@Body(ParseColumnIdPipe) dto: DeleteColumnDto) {
		const column = dto.column as ColumnWithTickets;

		return await this.boardService.deleteColumn(column);
	}

	@Patch('/:teamId/ticket/order')
	@UseGuards(AtGuard, TeamMemberGuard)
	async changeTicketOrder(
		@Param('teamId', ParseIntPipe) teamId: number,
		@Body(ParseTicketIdPipe) dto: UpdateTicketOrderDto,
	) {
		const { ticket, toBe, toBeColumnId } = dto;

		return await this.boardService.changeTicketOrder(ticket, toBe, toBeColumnId);
	}

	@Post('/:teamId/ticket')
	@UseGuards(AtGuard, TeamMemberGuard)
	async createTicket(@Body(ParseColumnIdPipe) dto: CreateTicketDto) {
		const { column, title, tag } = dto;

		return await this.boardService.createTicket(column, title, tag);
	}

	@Delete('/:teamId/:ticketId')
	@UseGuards(AtGuard, TeamMemberGuard)
	async deleteTicket(
		@Param('teamId', ParseIntPipe) teamId: number,
		@Param('ticketId', ParseIntPipe) ticketId: number,
	) {
		return await this.boardService.deleteTicket(teamId, ticketId);
	}
}
