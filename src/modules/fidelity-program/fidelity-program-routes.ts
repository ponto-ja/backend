import { FastifyInstance } from 'fastify';

import { registerFidelityProgram } from './controllers/register-fidelity-program';
import { getFidelityProgramSummary } from './controllers/get-fidelity-program-summary';
import { getFidelityProgram } from './controllers/get-fidelity-program';
import { updateFidelityProgram } from './controllers/update-fidelity-program';
import { findFidelityProgramsByParticipantId } from './controllers/find-fidelity-programs-by-participant-id';
import { getFidelityProgramByIdAndParticipantId } from './controllers/get-fidelity-program-by-id-and-participant-id';

import { registerFidelityProgramBodySchema } from './schemas/register-fidelity-program-schema';
import {
  updateFidelityProgramParamsSchema,
  updateFidelityProgramBodySchema,
} from './schemas/update-fidelity-program-schema';
import { findFidelityProgramsByParticipantIdParamsSchema } from './schemas/find-fidelity-programs-by-participant-id-schema';
import { getFidelityProgramByIdAndParticipantIdParamsSchema } from './schemas/get-fidelity-program-by-id-and-participant-id-schema';

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

  app.get('/list_by_participant/:participantId', async (request, reply) => {
    const { participantId } = findFidelityProgramsByParticipantIdParamsSchema.parse(
      request.query,
    );

    const { code, data, error } = await findFidelityProgramsByParticipantId({
      id: participantId,
    });

    switch (code) {
      case 'PARTICIPANT_NOT_FOUND': {
        return reply.status(404).send({ code });
      }

      case 'FIDELITY_PROGRAMS_FOUND': {
        return reply.status(200).send(data);
      }

      case 'UNEXPECTED_ERROR': {
        return reply.status(500).send({ error });
      }
    }
  });

  app.get(
    '/:fidelityProgramId/information_by_participant/:participantId',
    async (request, reply) => {
      const { fidelityProgramId, participantId } =
        getFidelityProgramByIdAndParticipantIdParamsSchema.parse(request.params);

      const { code, data, error } = await getFidelityProgramByIdAndParticipantId({
        fidelityProgramId,
        participantId,
      });

      switch (code) {
        case 'FIDELITY_PROGRAM_FOUND': {
          return reply.status(200).send(data);
        }

        case 'PARTICIPANT_NOT_FOUND': {
          return reply.status(404).send({ code });
        }

        case 'FIDELITY_PROGRAM_NOT_FOUND': {
          return reply.status(404).send({ code });
        }

        case 'UNEXPECTED_ERROR': {
          return reply.status(500).send({ error });
        }
      }
    },
  );
};
