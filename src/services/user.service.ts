import { BadRequestException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { EncryptionHelper } from 'src/helpers/encryption.helper';
import { PrismaService } from 'src/services/prisma.service';

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

		return await this.prisma.user.create({
			data: {
				username,
				password: await this.encryptionHelper.encryption(password),
			},
		});
	}

	async findOneWithRelation(where: Prisma.UserWhereUniqueInput, include?: Prisma.UserInclude) {
		return await this.prisma.user.findUnique({
			where,
			include,
		});
	}

	async findOne(where: Prisma.UserWhereUniqueInput, select?: Prisma.UserSelect) {
		return await this.prisma.user.findUnique({ select, where });
	}

	async update(where: Prisma.UserWhereUniqueInput, data: Prisma.UserUpdateManyMutationInput) {
		return await this.prisma.user.update({
			where,
			data,
		});
	}

	async validateCredentials(username: string, password: string) {
		const user = await this.findOne({ username });

		if (!user) {
			throw new NotFoundException('존재하지 않는 유저입니다.');
		}

		const matched = await this.encryptionHelper.compare(password, user.password);

		if (!matched) {
			throw new BadRequestException('비밀번호가 일치하지 않습니다.');
		}

		return user;
	}
}
