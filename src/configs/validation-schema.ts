import * as Joi from 'joi';

export const validationSchema = Joi.object({
	PORT: Joi.number().required(),

	POSTGRES_PASSWORD: Joi.string().required(),
	POSTGRES_DB: Joi.string().required(),
	DATABASE_URL: Joi.string().required(),
});
