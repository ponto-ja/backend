import fastify from 'fastify';
import { errorHandler } from './helpers/error-handler';
import { businessOwnerRoutes } from './modules/business-owner/business-owner-routes';

export const app = fastify();

app.setErrorHandler(errorHandler);

app.register(businessOwnerRoutes, { prefix: 'business_owner' });
