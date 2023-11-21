import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from '../configs/validation-schema';
import { PrismaModule } from './prisma.module';
import { AuthModule } from './auth.module';
import { UserModule } from './user.module';
import { ProvideModule } from './provide.module';
import jwtConfiguration from 'src/configs/jwt.configuration';

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
	],
})
export class AppModule {}
