import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Prisma } from '@prisma/client';
import { InviteService } from './invite.service';

@Injectable()
export class TeamService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly inviteService: InviteService,
	) {}

	async invite(teamId: number, inviteeId: number) {
		return await this.inviteService.invite(teamId, inviteeId);
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
}
