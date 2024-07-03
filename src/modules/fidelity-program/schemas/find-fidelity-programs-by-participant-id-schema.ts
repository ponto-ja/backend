import { z } from 'zod';

export const findFidelityProgramsByParticipantIdParamsSchema = z.object({
  participantId: z
    .string({
      required_error: 'participantId is a required param',
      invalid_type_error: 'participantId must be a string',
    })
    .min(1, { message: 'participantId is a required param' })
    .cuid({ message: 'participantId must be a cuid' }),
});
