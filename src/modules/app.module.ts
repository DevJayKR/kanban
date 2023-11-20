import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from '../configs/validation-schema';
import { PrismaModule } from './prisma.module';
import { AuthModule } from './auth.module';
import { UserModule } from './user.module';
import { ProvideModule } from './provide.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchema,
		}),
		PrismaModule,
		AuthModule,
		UserModule,
		ProvideModule,
	],
})
export class AppModule {}
