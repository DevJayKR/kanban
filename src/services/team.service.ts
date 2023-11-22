import { BadRequestException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Prisma } from '@prisma/client';
import { InviteService } from './invite.service';

@Injectable()
export class TeamService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly inviteService: InviteService,
	) {}

	async invite(teamId: number, inviteeId: number, invitorId: number) {
		return await this.inviteService.invite(teamId, inviteeId, invitorId);
	}

	async accept(inviteId: number, inviteeId: number) {
		const accepted = await this.inviteService.accept(inviteId, inviteeId);

		await this.update({
			where: { id: accepted.teamId },
			data: {
				members: {
					connect: {
						id: inviteeId,
					},
				},
			},
		});

		return accepted;
	}

	async create(userId: number, name: string) {
		const exist = await this.findOne({ name });

		if (exist) {
			throw new UnprocessableEntityException('이미 존재하는 팀 명입니다.');
		}

		return await this.prisma.team.create({
			data: {
				leader: {
					connect: {
						id: userId,
					},
				},
				name,
			},
		});
	}

	async findOne(where: Prisma.TeamWhereUniqueInput, select?: Prisma.TeamSelect) {
		return await this.prisma.team.findUnique({ select, where });
	}

	async update(input: Prisma.TeamUpdateArgs) {
		return await this.prisma.team.update(input);
	}

	async createColumn(name: string, teamId: number, userId: number) {
		const validateTeamMember = await this.isTeamMemberOrLeader(teamId, userId);
		const exist = await this.isExistColumnName(name, teamId);

		if (!validateTeamMember) {
			throw new BadRequestException('해당 팀의 멤버가 아닙니다.');
		}

		if (exist) {
			throw new BadRequestException('이미 존재하는 컬럼 명입니다.');
		}

		const count = await this.getColumnCount(teamId);

		await this.update({
			data: {
				columns: {
					create: {
						name,
						order: count + 1,
					},
				},
			},
			where: {
				id: teamId,
			},
		});
	}

	async findColumns(teamId: number, userId: number) {
		const validateTeamMember = await this.isTeamMemberOrLeader(teamId, userId);

		if (!validateTeamMember) {
			throw new BadRequestException('해당 팀의 멤버가 아닙니다.');
		}

		return await this.prisma.team.findMany({
			select: {
				columns: {
					select: {
						id: true,
						name: true,
						order: true,
						tickets: true,
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

	private async getColumnCount(teamId: number) {
		return await this.prisma.column.count({
			where: {
				teamId,
			},
		});
	}

	async changeColumnOrder(columnId: number, toBe: number, teamId: number, userId: number) {
		const validateTeamMember = await this.isTeamMemberOrLeader(teamId, userId);

		if (!validateTeamMember) {
			throw new BadRequestException('팀의 멤버만 변경할 수 있습니다.');
		}

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

	private async isTeamMemberOrLeader(teamId: number, userId: number) {
		return await this.prisma.team.findFirst({
			where: {
				AND: [
					{ id: teamId },
					{
						OR: [{ leaderId: userId }, { members: { some: { id: userId } } }],
					},
				],
			},
		});
	}

	private async isExistColumnName(name: string, teamId: number) {
		return await this.prisma.team.findFirst({
			where: {
				AND: [
					{
						id: teamId,
						columns: {
							some: {
								name,
							},
						},
					},
				],
			},
		});
	}
}
