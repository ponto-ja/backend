import { z } from 'zod';

export const registerBusinessOwnerBodySchema = z.object({
  firstName: z
    .string({
      required_error: 'firstName is a required field',
      invalid_type_error: 'firstName must be a string',
    })
    .min(1, { message: 'firstName is a required field' }),
  lastName: z
    .string({
      required_error: 'lastName is a required field',
      invalid_type_error: 'lastName must be a string',
    })
    .min(1, { message: 'lastName is a required field' }),
  email: z
    .string({
      required_error: 'email is a required field',
      invalid_type_error: 'email must be a string',
    })
    .min(1, { message: 'email is a required field' })
    .email({ message: 'invalid email' }),
});
