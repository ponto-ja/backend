import { z } from 'zod';

export const exchangeScoreBodySchema = z.object({
  participantId: z
    .string({
      required_error: 'participantId is a required field in participant',
      invalid_type_error: 'participantId must be a string',
    })
    .min(1, { message: 'participantId is a required field' })
    .cuid({ message: 'participantId must be a cuid' }),
  rewardId: z
    .string({
      required_error: 'rewardId is a required field in participant',
      invalid_type_error: 'rewardId must be a string',
    })
    .min(1, { message: 'rewardId is a required field' })
    .cuid({ message: 'rewardId must be a cuid' }),
  fidelityProgramId: z
    .string({
      required_error: 'fidelityProgramId is a required field in participant',
      invalid_type_error: 'fidelityProgramId must be a string',
    })
    .min(1, { message: 'fidelityProgramId is a required field' })
    .cuid({ message: 'fidelityProgramId must be a cuid' }),
});
