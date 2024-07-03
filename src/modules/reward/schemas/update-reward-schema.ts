import { z } from 'zod';

export const updateRewardParamsSchema = z.object({
  id: z
    .string({
      required_error: 'id is a required param',
      invalid_type_error: 'id must be a string',
    })
    .min(1, { message: 'id is a required param' })
    .cuid({ message: 'id must be a cuid' }),
});

export const updateRewardBodySchema = z.object({
  name: z
    .string({
      invalid_type_error: 'name must be a string',
    })
    .min(1, { message: 'name cannot be an empty string' })
    .optional(),
  scoreNeeded: z
    .number({
      invalid_type_error: 'scoreRate must be a number',
    })
    .optional(),
  description: z
    .string({
      invalid_type_error: 'description must be a string',
    })
    .min(1, { message: 'description cannot be an empty string' })
    .optional()
    .nullable(),
});
