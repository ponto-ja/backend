import { FastifyInstance } from 'fastify';

import { registerFidelityProgram } from './controllers/register-fidelity-program';
import { getFidelityProgramSummary } from './controllers/get-fidelity-program-summary';
import { getFidelityProgram } from './controllers/get-fidelity-program';
import { updateFidelityProgram } from './controllers/update-fidelity-program';

import { registerFidelityProgramBodySchema } from './schemas/register-fidelity-program-schema';
import {
  updateFidelityProgramParamsSchema,
  updateFidelityProgramBodySchema,
} from './schemas/update-fidelity-program-schema';

import { checkAPIKey } from '@/common/middlewares/check-api-key';
import { checkSubscription } from '@/common/middlewares/check-subscription';

export const fidelityProgramRoutes = async (app: FastifyInstance) => {
  app.addHook('onRequest', checkAPIKey);

  app.post('/register', { onRequest: [checkSubscription] }, async (request, reply) => {
    const { name, scoreRate, rewards } = registerFidelityProgramBodySchema.parse(
      request.body,
    );

    const { code, data, error } = await registerFidelityProgram({
      businessOwnerId: request.businessOwner.id,
      name,
      scoreRate,
      rewards,
    });

    switch (code) {
      case 'REGISTERED': {
        return reply.status(201).send({ code, fidelityProgram: { id: data!.id } });
      }

      case 'REWARDS_CANNOT_BE_EMPTY_LIST': {
        return reply.status(400).send({ code });
      }

      case 'FIDELITY_PROGRAM_ALREADY_EXISTS': {
        return reply.status(409).send({ code });
      }

      case 'UNEXPECTED_ERROR': {
        return reply.status(500).send({ error });
      }
    }
  });

  app.get('/summary', async (request, reply) => {
    const { code, data, error } = await getFidelityProgramSummary({
      businessOwnerId: request.businessOwner.id,
    });

    switch (code) {
      case 'FIDELITY_PROGRAM_FOUND': {
        return reply.status(200).send(data);
      }

      case 'FIDELITY_PROGRAM_NOT_FOUND': {
        return reply.status(404).send({ code });
      }

      case 'UNEXPECTED_ERROR': {
        return reply.status(500).send({ error });
      }
    }
  });

  app.get('/', async (request, reply) => {
    const { code, data, error } = await getFidelityProgram({
      businessOwnerId: request.businessOwner.id,
    });

    switch (code) {
      case 'FIDELITY_PROGRAM_FOUND': {
        return reply.status(200).send(data);
      }

      case 'FIDELITY_PROGRAM_NOT_FOUND': {
        return reply.status(404).send({ code });
      }

      case 'UNEXPECTED_ERROR': {
        return reply.status(500).send({ error });
      }
    }
  });

  app.patch('/:id', { onRequest: [checkSubscription] }, async (request, reply) => {
    const { id } = updateFidelityProgramParamsSchema.parse(request.params);
    const { name, scoreRate } = updateFidelityProgramBodySchema.parse(request.body);

    const { code, error } = await updateFidelityProgram({ id, name, scoreRate });

    switch (code) {
      case 'UPDATED': {
        return reply.status(200).send({ code });
      }

      case 'FIDELITY_PROGRAM_NOT_FOUND': {
        return reply.status(404).send({ code });
      }

      case 'UNEXPECTED_ERROR': {
        return reply.status(500).send({ error });
      }
    }
  });
};
