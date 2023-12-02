import { BadRequestException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Column, Tag, Ticket } from '@prisma/client';

@Injectable()
export class BoardService {
	constructor(private readonly prisma: PrismaService) {}

	async createColumn(teamId: number, name: string) {
		await this.isExistColumnName(teamId, name);

		const count = await this.getColumnsCount(teamId);

		return await this.prisma.column.create({
			data: {
				teamId,
				name,
				order: count + 1,
			},
			select: {
				id: true,
				name: true,
				order: true,
			},
		});
	}

	async findColumns(teamId: number) {
		return await this.prisma.team.findMany({
			select: {
				columns: {
					select: {
						id: true,
						name: true,
						order: true,
						tickets: {
							select: {
								id: true,
								order: true,
								assignee: true,
								info: true,
							},
							orderBy: {
								order: 'asc',
							},
						},
					},
					orderBy: {
						order: 'asc',
					},
				},
			},
			where: {
				id: teamId,
			},
		});
	}

	async changeColumnOrder(column: Column, toBe: number, teamId: number) {
		if (column.order == toBe) {
			return;
		}

		await this.prisma.$transaction(async (prisma) => {
			const columnCount = await this.getColumnsCount(teamId);

			if (toBe <= 0) {
				toBe = 1;
			}

			if (columnCount < toBe) {
				toBe = columnCount;
			}

			await prisma.column.updateMany({
				where: {
					teamId: teamId,
					order: {
						gte: Math.min(column.order, toBe),
						lte: Math.max(column.order, toBe),
						not: column.order,
					},
				},
				data: {
					order: {
						increment: column.order < toBe ? -1 : 1,
					},
				},
			});

			await prisma.column.update({
				where: {
					id: column.id,
					teamId: teamId,
				},
				data: {
					order: toBe,
				},
			});
		});

		return await this.prisma.column.findUnique({
			where: {
				id: column.id,
			},
		});
	}

	async createTicket(column: Column, title: string, tag: Tag) {
		const count = await this.getTicketsCount(column.id);

		return await this.prisma.ticket.create({
			data: {
				column: {
					connect: {
						id: column.id,
					},
				},
				order: count + 1,
				info: {
					create: {
						title,
						tag,
					},
				},
			},
			select: {
				assigneeId: true,
				info: {
					select: {
						id: true,
						title: true,
						tag: true,
						dueTime: true,
						dueDate: true,
					},
				},
			},
		});
	}

	async changeTicketOrder(ticket: Ticket, toBe: number, toBeColumnId?: number) {
		if (toBe <= 0) {
			toBe = 1;
		}

		await this.validateChangeTicketOrder(ticket.id, toBeColumnId);

		return await this.prisma.$transaction(async (tx) => {
			const ticketCount =
				ticket.columnId !== toBeColumnId
					? await this.getTicketsCount(toBeColumnId)
					: await this.getTicketsCount(ticket.columnId);

			if (ticket.columnId !== toBeColumnId) {
				// 순서 변경: 다른 컬럼으로 이동할 때
				await tx.ticket.updateMany({
					where: {
						columnId: ticket.columnId,
						order: {
							gte: ticket.order,
						},
					},
					data: {
						order: {
							increment: -1,
						},
					},
				});

				await tx.ticket.updateMany({
					where: {
						columnId: toBeColumnId,
						order: {
							gte: toBe,
						},
					},
					data: {
						order: {
							increment: 1,
						},
					},
				});

				if (toBe > ticketCount + 1) {
					throw new BadRequestException('티켓 순서는 티켓 총 갯수에 1을 더한 숫자를 넘을 수 없습니다.');
				}

				return await tx.ticket.update({
					where: {
						id: ticket.id,
					},
					data: {
						order: ticketCount <= 0 ? 1 : toBe,
						columnId: toBeColumnId,
					},
				});
			} else {
				// 같은 컬럼 내에서의 순서 변경
				await tx.ticket.updateMany({
					where: {
						columnId: toBeColumnId,
						order: {
							gte: Math.min(ticket.order, toBe),
							lte: Math.max(ticket.order, toBe),
							not: ticket.order,
						},
					},
					data: {
						order: {
							increment: ticket.order < toBe ? -1 : 1,
						},
					},
				});

				if (toBe > ticketCount + 1) {
					throw new BadRequestException('티켓 순서는 티켓 총 갯수에 1을 더한 숫자를 넘을 수 없습니다.');
				}

				return await tx.ticket.update({
					where: {
						id: ticket.id,
					},
					data: {
						order: toBe,
					},
				});
			}
		});
	}

	private async isExistColumnName(teamId: number, name: string) {
		const exist = await this.prisma.team.count({
			where: {
				id: teamId,
				columns: {
					some: {
						name,
					},
				},
			},
		});

		if (exist) {
			throw new UnprocessableEntityException('이미 존재하는 컬럼명입니다.');
		}
	}

	private async getColumnsCount(teamId: number) {
		return await this.prisma.column.count({
			where: {
				teamId,
			},
		});
	}

	private async getTicketsCount(columnId: number) {
		return await this.prisma.ticket.count({
			where: {
				columnId,
			},
		});
	}

	private async validateChangeTicketOrder(ticketId: number, columnId: number) {
		const column = await this.prisma.team.findFirst({
			select: {
				id: true,
			},
			where: {
				columns: { some: { id: columnId } },
			},
		});

		const ticket = await this.prisma.team.findFirst({
			select: {
				id: true,
			},
			where: {
				columns: {
					some: {
						tickets: {
							some: {
								id: ticketId,
							},
						},
					},
				},
			},
		});

		if (!column) {
			throw new BadRequestException('존재하지 않는 컬럼입니다.');
		}

		if (!ticket) {
			throw new BadRequestException('존재하지 않는 티켓입니다.');
		}

		if (!(ticket.id == column.id)) {
			throw new BadRequestException('티켓 이동은 같은 팀의 컬럼에만 가능합니다. 다시 확인해주세요.');
		}
	}
}
