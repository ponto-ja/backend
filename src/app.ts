import fastify from 'fastify';
import fastifyJWT from '@fastify/jwt';
import { errorHandler } from './helpers/error-handler';
import { businessOwnerRoutes } from './modules/business-owner/business-owner-routes';
import { fidelityProgramRoutes } from './modules/fidelity-program/fidelity-program-routes';
import { rewardRoutes } from './modules/reward/reward-routes';
import { participantRoutes } from './modules/participant/participant-routes';

export const app = fastify();

app.register(fastifyJWT, {
  secret: process.env.JWT_SECRET as string,
});

app.setErrorHandler(errorHandler);

app.register(businessOwnerRoutes, { prefix: 'business_owner' });
app.register(fidelityProgramRoutes, { prefix: 'fidelity_program' });
app.register(rewardRoutes, { prefix: 'reward' });
app.register(participantRoutes, { prefix: 'participant' });
