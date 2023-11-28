import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TeamService {
	constructor(private readonly prisma: PrismaService) {}

	async invite(teamId: number, inviteeId: number) {
		return await this.prisma.invite.create({
			data: {
				team: {
					connect: { id: teamId },
				},
				invitee: {
					connect: { id: inviteeId },
				},
			},
		});
	}

	async accept(inviteId: number, inviteeId: number) {
		const invite = await this.prisma.invite.update({
			data: {
				accept: true,
			},
			where: {
				id: inviteId,
				accept: false,
				inviteeId,
			},
		});

		await this.prisma.team.update({
			where: { id: invite.teamId },
			data: {
				members: {
					connect: {
						id: inviteeId,
					},
				},
			},
		});

		return invite;
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

	async isTeamLeader(teamId: number, userId: number) {
		const isMatched = await this.prisma.team.findUnique({
			where: {
				id: teamId,
				leaderId: userId,
			},
		});

		if (isMatched) return true;
	}

	async isTeamMemberOrLeader(teamId: number, userId: number) {
		const isMatched = await this.prisma.team.findFirst({
			where: {
				AND: [
					{ id: teamId },
					{
						OR: [{ leaderId: userId }, { members: { some: { id: userId } } }],
					},
				],
			},
		});

		if (isMatched) return true;
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
