import { Module } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthController } from '../controllers/auth.controller';
import { UserModule } from 'src/modules/user.module';

@Module({
	imports: [UserModule],
	controllers: [AuthController],
	providers: [AuthService],
})
export class AuthModule {}
