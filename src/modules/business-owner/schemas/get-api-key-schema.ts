import { z } from 'zod';

export const getAPIKeyParamsSchema = z.object({
  businessOwnerId: z
    .string({
      required_error: 'businessOwnerId is a required param',
      invalid_type_error: 'businessOwnerId must be a string',
    })
    .min(1, { message: 'businessOwnerId is a required param' })
    .cuid({ message: 'businessOwnerId must be a cuid' }),
});
