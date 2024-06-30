import { z } from 'zod';

export const authenticateBusinessOwnerParamsSchema = z.object({
  email: z
    .string({
      required_error: 'email is a required param',
      invalid_type_error: 'email must be a string',
    })
    .min(1, { message: 'email is a required param' })
    .email({ message: 'invalid email' }),
});
