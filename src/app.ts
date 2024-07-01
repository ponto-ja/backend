import fastify from 'fastify';
import fastifyJWT from '@fastify/jwt';
import { errorHandler } from './helpers/error-handler';
import { businessOwnerRoutes } from './modules/business-owner/business-owner-routes';

export const app = fastify();

app.register(fastifyJWT, {
  secret: process.env.JWT_SECRET as string,
});

app.setErrorHandler(errorHandler);

app.register(businessOwnerRoutes, { prefix: 'business_owner' });
