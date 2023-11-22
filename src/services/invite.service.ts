import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class InviteService {
	constructor(private readonly prisma: PrismaService) {}

	async invite(teamId: number, inviteeId: number, invitorId: number) {
		const isTeamLeader = await this.validateTeamLeader(teamId, invitorId);

		if (!isTeamLeader) {
			throw new BadRequestException('팀의 리더만 초대할 수 있습니다.');
		}

		const exist = await this.findFirst({
			teamId,
			inviteeId,
		});

		if (exist) {
			throw new BadRequestException('이미 초대한 유저입니다.');
		}

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

	async findFirst(where: Prisma.InviteWhereInput) {
		return await this.prisma.invite.findFirst({
			where,
		});
	}

	async findOne(where: Prisma.InviteWhereUniqueInput) {
		return await this.prisma.invite.findUnique({ where });
	}

	async accept(inviteId: number, inviteeId: number) {
		const exist = await this.findOne({
			id: inviteId,
			invitee: {
				id: inviteeId,
			},
		});

		if (!exist) {
			throw new BadRequestException('존재하지 않는 초대입니다.');
		}

		if (exist.accept) {
			throw new BadRequestException('이미 수락한 초대입니다.');
		}

		return await this.prisma.invite.update({
			data: {
				accept: true,
			},
			where: {
				id: inviteId,
				invitee: {
					id: inviteeId,
				},
			},
		});
	}

	private async validateTeamLeader(teamId: number, invitorId: number) {
		return await this.prisma.invite.findFirst({
			where: {
				team: {
					id: teamId,
					leaderId: invitorId,
				},
			},
		});
	}
}
