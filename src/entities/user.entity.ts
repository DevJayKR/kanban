import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity implements User {
	id: number;
	username: string;

	@Exclude()
	password: string;

	@Exclude()
	refreshToken: string;
}
