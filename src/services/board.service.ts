import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Column, Tag } from '@prisma/client';

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
		const count = await this.getTicketsCount(column);

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

	// TODO: 여기 작업
	async changeTicketOrder() {}

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

	private async getTicketsCount(column: Column) {
		return await this.prisma.ticket.count({
			where: {
				columnId: column.id,
			},
		});
	}
}
