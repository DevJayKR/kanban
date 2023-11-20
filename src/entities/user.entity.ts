import { User as TUser } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class User implements TUser {
	id: number;
	username: string;

	@Exclude()
	password: string;

	@Exclude()
	refreshToken: string;
}
