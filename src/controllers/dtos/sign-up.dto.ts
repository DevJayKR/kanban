import { Prisma } from '@prisma/client';
import { CustomValidator as CV } from '@utils/custom-validator.class';

export class SignUpDto implements Prisma.UserCreateInput {
	@CV.IsUsername()
	username: string;

	@CV.IsPassword()
	password: string;
}
