import { z } from 'zod';

export const getParticipantByPhoneNumberParamsSchema = z.object({
  phoneNumber: z
    .string({
      required_error: 'phoneNumber is a required param',
      invalid_type_error: 'phoneNumber must be a string',
    })
    .min(1, { message: 'phoneNumber is a required param' }),
});
