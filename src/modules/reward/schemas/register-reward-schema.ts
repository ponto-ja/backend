import { z } from 'zod';

export const registerRewardBodySchema = z.object({
  fidelityProgramId: z
    .string({
      required_error: 'fidelityProgramId is a required param',
      invalid_type_error: 'fidelityProgramId must be a string',
    })
    .min(1, { message: 'fidelityProgramId is a required param' })
    .cuid({ message: 'fidelityProgramId must be a cuid' }),
  name: z
    .string({
      required_error: 'name is a required field',
      invalid_type_error: 'name must be a string',
    })
    .min(1, { message: 'name is a required field' }),
  scoreNeeded: z.number({
    required_error: 'scoreNeeded is a required field',
    invalid_type_error: 'scoreNeeded must be a number',
  }),
  description: z
    .string({
      invalid_type_error: 'description must be a string',
    })
    .min(1, { message: 'description is a required field' })
    .nullable()
    .optional(),
});
