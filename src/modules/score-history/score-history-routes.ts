import { FastifyInstance } from 'fastify';

import { findParticipantScoreHistoryInFidelityProgram } from './controllers/find-participant-score-history-in-fidelity-program';

import { findParticipantScoreHistoryInFidelityProgramParamsSchema } from './schemas/find-participant-score-history-in-fidelity-program-schema';

import { checkAPIKey } from '@/common/middlewares/check-api-key';

export const scoreHistoryRoutes = async (app: FastifyInstance) => {
  app.addHook('onRequest', checkAPIKey);

  app.get(
    '/participants/:participantId/fidelity_programs/:fidelityProgramId',
    async (request, reply) => {
      const { fidelityProgramId, participantId } =
        findParticipantScoreHistoryInFidelityProgramParamsSchema.parse(request.params);

      const { error, code, data } = await findParticipantScoreHistoryInFidelityProgram({
        fidelityProgramId,
        participantId,
      });

      switch (code) {
        case 'SCORE_HISTORY_FOUND': {
          return reply.status(200).send(data);
        }

        case 'PARTICIPANT_NOT_FOUND':
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
