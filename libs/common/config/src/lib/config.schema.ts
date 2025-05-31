import * as Joi from 'joi';

export const baseSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().required(),
  HOST: Joi.string().required(),
  //   PORT: Joi.number().default(3000),
});

export const databaseSchema = Joi.object({
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_NAME: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
});

export const jwtSchema = Joi.object({
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRATION_TIME: Joi.string().required(),
});

export const redisSchema = Joi.object({
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),
  REDIS_DEFAULT_TTL: Joi.string().required(),
});

export const rabbitmqSchema = Joi.object({
  RABBITMQ_URL: Joi.string().required(),
  RABBITMQ_QUEUE: Joi.string().required(),
});

export const apiGatewayConnectionSchema = Joi.object({
  AUTH_SERVICE_URL: Joi.string().required(),
});
