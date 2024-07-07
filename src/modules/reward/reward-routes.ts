import { FastifyInstance } from 'fastify';

import { updateReward } from './controllers/update-reward';
import { deleteReward } from './controllers/delete-reward';
import { registerReward } from './controllers/register-reward';
import { findRewardsByFidelityProgramId } from './controllers/find-rewards-by-fidelity-program-id';

import {
  updateRewardBodySchema,
  updateRewardParamsSchema,
} from './schemas/update-reward-schema';
import { deleteRewardParamsSchema } from './schemas/delete-reward-schema';
import { registerRewardBodySchema } from './schemas/register-reward-schema';
import { findRewardsByFidelityProgramIdParamsSchema } from './schemas/find-rewards-by-fidelity-program-id-schema';

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

  app.post('/register', { onRequest: [checkSubscription] }, async (request, reply) => {
    const { fidelityProgramId, name, scoreNeeded, description } =
      registerRewardBodySchema.parse(request.body);

    const { code, error } = await registerReward({
      fidelityProgramId,
      name,
      scoreNeeded,
      description,
    });

    switch (code) {
      case 'REGISTERED': {
        return reply.status(201).send({ code });
      }

      case 'FIDELITY_PROGRAM_NOT_FOUND': {
        return reply.status(404).send({ code });
      }

      case 'UNEXPECTED_ERROR': {
        return reply.status(500).send({ error });
      }
    }
  });

  app.get('/list_by_fidelity_program/:fidelityProgramId', async (request, reply) => {
    const { fidelityProgramId } = findRewardsByFidelityProgramIdParamsSchema.parse(
      request.params,
    );

    const { code, data, error } = await findRewardsByFidelityProgramId({
      fidelityProgramId,
    });

    switch (code) {
      case 'REWARDS_FOUND': {
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
};
