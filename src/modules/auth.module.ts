import { Module } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthController } from '../controllers/auth.controller';
import { UserModule } from 'src/modules/user.module';
import { JwtHelper } from 'src/helpers/jwt.helper';
import { JwtModule } from '@nestjs/jwt';

@Module({
	imports: [UserModule, JwtModule],
	controllers: [AuthController],
	providers: [AuthService, JwtHelper],
})
export class AuthModule {}
