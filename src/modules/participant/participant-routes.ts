import { FastifyInstance } from 'fastify';

import { registerParticipant } from './controllers/register-participant';
import { getParticipantByPhoneNumber } from './controllers/get-participant-by-phone-number';
import { findParticipantsByFidelityProgramId } from './controllers/find-participants-by-fidelity-program-id';
import { registerParticipantInFidelityProgram } from './controllers/register-participant-in-fidelity-program';

import { registerParticipantBodySchema } from './schemas/register-participant-schema';
import { getParticipantByPhoneNumberParamsSchema } from './schemas/get-participant-by-phone-number-schema';
import { findParticipantsByFidelityProgramIdParamsSchema } from './schemas/find-participants-by-fidelity-program-id-schema';
import { registerParticipantInFidelityProgramBodySchema } from './schemas/register-participant-in-fidelity-program-schema';

import { checkAPIKey } from '@/common/middlewares/check-api-key';
import { checkSubscription } from '@/common/middlewares/check-subscription';

export const participantRoutes = async (app: FastifyInstance) => {
  app.addHook('onRequest', checkAPIKey);

  app.post('/register', { onRequest: [checkSubscription] }, async (request, reply) => {
    const { firstName, lastName, phoneNumber } = registerParticipantBodySchema.parse(
      request.body,
    );

    const { code, error } = await registerParticipant({
      firstName,
      lastName,
      phoneNumber,
    });

    switch (code) {
      case 'REGISTERED': {
        return reply.status(200).send({ code });
      }

      case 'ALREADY_REGISTERED_PARTICIPANT': {
        return reply.status(409).send({ code });
      }

      case 'UNEXPECTED_ERROR': {
        return reply.status(500).send({ error });
      }
    }
  });

  app.get('/:phoneNumber', async (request, reply) => {
    const { phoneNumber } = getParticipantByPhoneNumberParamsSchema.parse(request.params);

    const { code, data, error } = await getParticipantByPhoneNumber({ phoneNumber });

    switch (code) {
      case 'PARTICIPANT_FOUND': {
        return reply.status(200).send(data);
      }

      case 'PARTICIPANT_NOT_FOUND': {
        return reply.status(404).send({ code });
      }

      case 'UNEXPECTED_ERROR': {
        return reply.status(500).send({ error });
      }
    }
  });

  app.get('/list_by_fidelity_program/:fidelityProgramId', async (request, reply) => {
    const { fidelityProgramId } = findParticipantsByFidelityProgramIdParamsSchema.parse(
      request.params,
    );

    const { code, data, error } = await findParticipantsByFidelityProgramId({
      id: fidelityProgramId,
    });

    switch (code) {
      case 'PARTICIPANTS_FOUND': {
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

  app.post(
    '/register_in_fidelity_program',
    { onRequest: [checkSubscription] },
    async (request, reply) => {
      const { participant, fidelityProgramId } =
        registerParticipantInFidelityProgramBodySchema.parse(request.body);

      const { code, error } = await registerParticipantInFidelityProgram({
        participant,
        fidelityProgramId,
      });

      switch (code) {
        case 'PARTICIPANT_REGISTERED_IN_PROGRAM': {
          return reply.status(201).send({ code });
        }

        case 'FIDELITY_PROGRAM_NOT_FOUND': {
          return reply.status(404).send({ code });
        }

        case 'PARTICIPANT_IS_ALREADY_IN_PROGRAM': {
          return reply.status(409).send({ code });
        }

        case 'UNEXPECTED_ERROR': {
          return reply.status(500).send({ error });
        }
      }
    },
  );
};
