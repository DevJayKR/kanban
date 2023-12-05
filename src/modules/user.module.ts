import { Module } from '@nestjs/common';
import { UserService } from '@services/user.service';
import { UserController } from '@controllers/user.controller';
import { PrismaModule } from '@modules/prisma.module';
import { EncryptionHelper } from '@helpers/encryption.helper';

@Module({
	imports: [PrismaModule],
	controllers: [UserController],
	providers: [UserService, EncryptionHelper],
	exports: [UserService],
})
export class UserModule {}
