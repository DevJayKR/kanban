import { Module } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserController } from '../controllers/user.controller';
import { PrismaModule } from 'src/modules/prisma.module';
import { EncryptionHelper } from 'src/helpers/encryption.helper';

@Module({
	imports: [PrismaModule],
	controllers: [UserController],
	providers: [UserService, EncryptionHelper],
	exports: [UserService],
})
export class UserModule {}
