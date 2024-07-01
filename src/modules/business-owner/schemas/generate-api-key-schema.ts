import { z } from 'zod';

export const generateAPIKeyBodySchema = z.object({
  id: z
    .string({
      required_error: 'id is a required param',
      invalid_type_error: 'id must be a string',
    })
    .min(1, { message: 'id is a required param' })
    .cuid({ message: 'id must be a cuid' }),
  email: z
    .string({
      required_error: 'email is a required field',
      invalid_type_error: 'email must be a string',
    })
    .min(1, { message: 'email is a required field' })
    .email({ message: 'invalid email' }),
});
