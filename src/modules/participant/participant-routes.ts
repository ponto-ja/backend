import { FastifyInstance } from 'fastify';

import { registerParticipant } from './controllers/register-participant';

import { registerParticipantBodySchema } from './schemas/register-participant-schema';

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

      case 'PARTICIPANT_ALREADY_EXISTS': {
        return reply.status(409).send({ code });
      }

      case 'UNEXPECTED_ERROR': {
        return reply.status(500).send({ error });
      }
    }
  });
};
