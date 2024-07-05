import { z } from 'zod';

export const registerParticipantInFidelityProgramBodySchema = z.object({
  participant: z.object(
    {
      firstName: z
        .string({
          required_error: 'firstName is a required field in participant',
          invalid_type_error: 'firstName must be a string',
        })
        .min(1, { message: 'firstName is a required field in participant' }),
      lastName: z
        .string({
          required_error: 'lastName is a required field in participant',
          invalid_type_error: 'lastName must be a string',
        })
        .min(1, { message: 'lastName is a required field in participant' }),
      phoneNumber: z
        .string({
          required_error: 'phoneNumber is a required field in participant',
          invalid_type_error: 'phoneNumber must be a string',
        })
        .min(1, { message: 'phoneNumber is a required field' }),
    },
    { required_error: 'participant is a required field' },
  ),
  fidelityProgramId: z
    .string({
      required_error: 'fidelityProgramId is a required field in participant',
      invalid_type_error: 'fidelityProgramId must be a string',
    })
    .min(1, { message: 'fidelityProgramId is a required field' })
    .cuid({ message: 'fidelityProgramId must be a cuid' }),
});
