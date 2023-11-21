import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class TeamService {
	constructor(private readonly prisma: PrismaService) {}

	async create(user: User, name: string) {
		return await this.prisma.team.create({
			data: {
				leader: {
					connect: {
						id: user.id,
					},
				},
				name,
			},
		});
	}
}
