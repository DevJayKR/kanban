import { registerAs } from '@nestjs/config';

export default registerAs('jwtConfiguration', () => ({
	access: {
		secretKey: process.env.JWT_ACCESS_SECRET_KEY,
		expirationTime: process.env.JwT_ACCESS_EXPIRATION_TIME,
		expirationTimeAsSecond: process.env.JWT_ACCESS_EXPIRATION_TIME + 's',
	},

	refresh: {
		secretKey: process.env.JWT_REFRESH_SECRET_KEY,
		expirationTime: process.env.JwT_REFRESH_EXPIRATION_TIME,
		expirationTimeAsSecond: process.env.JWT_REFRESH_EXPIRATION_TIME + 's',
	},
}));
