import { z } from 'zod';

export const registerParticipantBodySchema = z.object({
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
  phoneNumber: z
    .string({
      required_error: 'phoneNumber is a required field',
      invalid_type_error: 'phoneNumber must be a string',
    })
    .min(1, { message: 'phoneNumber is a required field' }),
});
