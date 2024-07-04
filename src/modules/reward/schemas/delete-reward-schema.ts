import { z } from 'zod';

export const deleteRewardParamsSchema = z.object({
  id: z
    .string({
      required_error: 'id is a required param',
      invalid_type_error: 'id must be a string',
    })
    .min(1, { message: 'id is a required param' })
    .cuid({ message: 'id must be a cuid' }),
});
