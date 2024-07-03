import { FastifyInstance } from 'fastify';

import { registerFidelityProgram } from './controllers/register-fidelity-program';

import { registerFidelityProgramBodySchema } from './schemas/register-fidelity-programa-schema';

import { checkAPIKey } from '@/common/middlewares/check-api-key';

export const fidelityProgramRoutes = async (app: FastifyInstance) => {
  app.addHook('onRequest', checkAPIKey);

  app.post('/register', async (request, reply) => {
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
};
