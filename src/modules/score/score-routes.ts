import { FastifyInstance } from 'fastify';

import { registerScore } from './controllers/register-score';
import { exchangeScore } from './controllers/exchange-score';

import { registerScoreBodySchema } from './schemas/register-score-schema';
import { exchangeScoreBodySchema } from './schemas/exchange-score-schema';

import { checkAPIKey } from '@/common/middlewares/check-api-key';
import { checkSubscription } from '@/common/middlewares/check-subscription';

export const scoreRoutes = async (app: FastifyInstance) => {
  app.addHook('onRequest', checkAPIKey);
  app.addHook('onRequest', checkSubscription);

  app.post('/register', async (request, reply) => {
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

  app.post('/exchange', async (request, reply) => {
    const { participantId, rewardId, fidelityProgramId } = exchangeScoreBodySchema.parse(
      request.body,
    );

    const { code, error } = await exchangeScore({
      participantId,
      rewardId,
      fidelityProgramId,
    });

    switch (code) {
      case 'EXCHANGED_SCORES': {
        return reply.status(201).send({ code });
      }

      case 'PARTICIPANT_NOT_FOUND':
      case 'REWARD_NOT_FOUND':
      case 'FIDELITY_PROGRAM_NOT_FOUND': {
        return reply.status(404).send({ code });
      }

      case 'INSUFFICIENT_SCORE': {
        return reply.status(400).send({ code });
      }

      case 'UNEXPECTED_ERROR': {
        return reply.status(500).send({ error });
      }
    }
  });
};
