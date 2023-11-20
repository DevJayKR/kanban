import { Prisma } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignUpDto implements Prisma.UserCreateInput {
	@IsString()
	@IsNotEmpty()
	username: string;

	@IsString()
	@IsNotEmpty()
	password: string;
}
