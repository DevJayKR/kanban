import * as Joi from 'joi';

export const validationSchema = Joi.object({
	PORT: Joi.number().required(),

	POSTGRES_PASSWORD: Joi.string().required(),
	POSTGRES_DB: Joi.string().required(),
	DATABASE_URL: Joi.string().required(),

	JWT_ACCESS_SECRET_KEY: Joi.string().required(),
	JwT_ACCESS_EXPIRATION_TIME: Joi.number().required(),

	JWT_REFRESH_SECRET_KEY: Joi.string().required(),
	JwT_REFRESH_EXPIRATION_TIME: Joi.number().required(),
});
