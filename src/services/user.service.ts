import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { User } from 'src/entities/user.entity';
import { EncryptionHelper } from 'src/helpers/encryption.helper';
import { PrismaService } from 'src/services/prisma.service';
import { serializer } from 'src/utils/serializer';

@Injectable()
export class UserService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly encryptionHelper: EncryptionHelper,
	) {}

	async create(username: string, password: string) {
		const isExist = await this.findOne({
			username,
		});

		if (isExist) {
			throw new UnprocessableEntityException('이미 존재하는 유저네임입니다.');
		}

		return serializer(
			User,
			await this.prisma.user.create({
				data: {
					username,
					password: await this.encryptionHelper.encryption(password),
				},
			}),
		);
	}

	async findOne(where: Prisma.UserWhereUniqueInput, select?: Prisma.UserSelect) {
		return await this.prisma.user.findUnique({ select, where });
	}

	async validateCredentials(username: string, password: string) {
		const user = await this.findOne({ username });

		if (!user) {
			throw new NotFoundException('존재하지 않는 유저입니다.');
		}

		const matched = await this.encryptionHelper.compare(password, user.password);

		if (matched) {
			return serializer(User, user);
		}
	}
}
