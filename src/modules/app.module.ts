import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from '../configs/validation-schema';
import { PrismaModule } from './prisma.module';
import { AuthModule } from './auth.module';
import { UserModule } from './user.module';
import { ProvideModule } from './provide.module';
import jwtConfiguration from 'src/configs/jwt.configuration';
import { TeamModule } from './team.module';
import { BoardModule } from './board.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchema,
			load: [jwtConfiguration],
		}),
		PrismaModule,
		AuthModule,
		UserModule,
		ProvideModule,
		TeamModule,
		BoardModule,
	],
})
export class AppModule {}
