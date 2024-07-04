import { FastifyInstance } from 'fastify';

import { updateReward } from './controllers/update-reward';
import { deleteReward } from './controllers/delete-reward';

import {
  updateRewardBodySchema,
  updateRewardParamsSchema,
} from './schemas/update-reward-schema';
import { deleteRewardParamsSchema } from './schemas/delete-reward-schema';

import { checkAPIKey } from '@/common/middlewares/check-api-key';
import { checkSubscription } from '@/common/middlewares/check-subscription';

export const rewardRoutes = async (app: FastifyInstance) => {
  app.addHook('onRequest', checkAPIKey);

  app.patch('/:id', { onRequest: [checkSubscription] }, async (request, reply) => {
    const { id } = updateRewardParamsSchema.parse(request.params);
    const { name, scoreNeeded, description } = updateRewardBodySchema.parse(request.body);

    const { code, error } = await updateReward({ id, name, scoreNeeded, description });

    switch (code) {
      case 'UPDATED': {
        return reply.status(200).send({ code });
      }

      case 'REWARD_NOT_FOUND': {
        return reply.status(404).send({ code });
      }

      case 'UNEXPECTED_ERROR': {
        return reply.status(500).send({ error });
      }
    }
  });

  app.delete('/:id', { onRequest: [checkSubscription] }, async (request, reply) => {
    const { id } = deleteRewardParamsSchema.parse(request.params);

    const { code, error } = await deleteReward({ id });

    switch (code) {
      case 'DELETED': {
        return reply.status(200).send({ code });
      }

      case 'REWARD_NOT_FOUND': {
        return reply.status(404).send({ code });
      }

      case 'UNEXPECTED_ERROR': {
        return reply.status(500).send({ error });
      }
    }
  });
};
