import { FastifyInstance } from 'fastify';

import { registerScore } from './controllers/register-score';

import { registerScoreBodySchema } from './schemas/register-score-schema';

import { checkAPIKey } from '@/common/middlewares/check-api-key';
import { checkSubscription } from '@/common/middlewares/check-subscription';

export const scoreRoutes = async (app: FastifyInstance) => {
  app.addHook('onRequest', checkAPIKey);

  app.post('/register', { onRequest: [checkSubscription] }, async (request, reply) => {
    const { participant, fidelityProgramId, score } = registerScoreBodySchema.parse(
      request.body,
    );

    const { error, code } = await registerScore({
      participant,
      fidelityProgramId,
      score,
    });

    switch (code) {
      case 'REGISTERED': {
        return reply.status(201).send({ code });
      }

      case 'INSUFFICIENT_SCORE': {
        return reply.status(400).send({ code });
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
