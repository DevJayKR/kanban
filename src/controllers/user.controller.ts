import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { AtGuard } from './guards/at.guard';
import { Serializer } from './decorators/serializer.decorator';
import { User } from '@prisma/client';
import { UserEntity } from 'src/entities/user.entity';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	@UseGuards(AtGuard)
	@Serializer(UserEntity)
	async info(@CurrentUser() user: User) {
		const { id } = user;

		return await this.userService.findOneWithRelation(
			{
				id,
			},
			{
				invite: {
					where: {
						accept: false,
					},
				},
				teams: true,
				teamLeads: true,
			},
		);
	}
}
