import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Tag } from '@prisma/client';

@Injectable()
export class TicketService {
	constructor(private readonly prisma: PrismaService) {}

	async create(columnId: number, title: string, tag: Tag) {
		return await this.prisma.ticket.create({
			data: {
				column: {
					connect: {
						id: columnId,
					},
				},
				order: (await this.getTicketsCount(columnId)) + 1,
				info: {
					create: {
						title,
						tag,
					},
				},
			},
			select: {
				assigneeId: true,
				info: true,
				order: true,
			},
		});
	}

	async changeTicketPosition(columnId: number, toBe: number, teamId: number, userId: number) {
		await this.prisma.$transaction(async (prisma) => {
			const column = await prisma.column.findUnique({
				where: {
					id: columnId,
				},
			});

			if (column.order === toBe) {
				return;
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
					id: columnId,
					teamId: teamId,
				},
				data: {
					order: toBe,
				},
			});
		});
	}

	private async getTicketsCount(columnId: number) {
		return await this.prisma.ticket.count({
			where: {
				columnId,
			},
		});
	}
}
