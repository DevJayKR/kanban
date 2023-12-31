import { Module } from '@nestjs/common';
import { AuthService } from '@services/auth.service';
import { AuthController } from '@controllers/auth.controller';
import { UserModule } from '@modules/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AtStrategy } from '@controllers/guards/strategies/at.strategy';
import { RtStrategy } from '@controllers/guards/strategies/rt.strategy';
import { JwtService } from '@services/jwt.service';

@Module({
	imports: [UserModule, JwtModule],
	controllers: [AuthController],
	providers: [AuthService, JwtService, AtStrategy, RtStrategy],
})
export class AuthModule {}
