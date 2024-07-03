import { z } from 'zod';

export const updateFidelityProgramParamsSchema = z.object({
  id: z
    .string({
      required_error: 'id is a required param',
      invalid_type_error: 'id must be a string',
    })
    .min(1, { message: 'id is a required param' })
    .cuid({ message: 'id must be a cuid' }),
});

export const updateFidelityProgramBodySchema = z.object({
  name: z
    .string({
      invalid_type_error: 'name must be a string',
    })
    .min(1, { message: 'name is a required field' })
    .optional(),
  scoreRate: z
    .number({
      invalid_type_error: 'scoreRate must be a number',
    })
    .optional(),
});
