import { z } from 'zod';

export const findRewardsByFidelityProgramIdParamsSchema = z.object({
  fidelityProgramId: z
    .string({
      required_error: 'fidelityProgramId is a required param',
      invalid_type_error: 'fidelityProgramId must be a string',
    })
    .min(1, { message: 'fidelityProgramId is a required param' })
    .cuid({ message: 'fidelityProgramId must be a cuid' }),
});
