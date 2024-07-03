import { z } from 'zod';

export const registerFidelityProgramBodySchema = z.object({
  name: z
    .string({
      required_error: 'name is a required field',
      invalid_type_error: 'name must be a string',
    })
    .min(1, { message: 'name is a required field' }),
  scoreRate: z.number({
    required_error: 'scoreRate is a required field',
    invalid_type_error: 'scoreRate must be a number',
  }),
  rewards: z
    .array(
      z.object({
        name: z
          .string({
            required_error: 'name is a required field on rewards',
            invalid_type_error: 'name must be a string on rewards',
          })
          .min(1, { message: 'name is a required field on rewards' }),
        scoreNeeded: z.number({
          required_error: 'scoreNeeded is a required field',
          invalid_type_error: 'scoreNeeded must be a number',
        }),
        description: z
          .string({
            invalid_type_error: 'description must be a string on rewards',
          })
          .min(1, { message: 'description is a required field on rewards' })
          .nullable()
          .optional(),
      }),
    )
    .nonempty({ message: 'rewards must have at least one reward' })
    .optional()
    .refine((input) => input !== undefined, { message: 'rewards is a required field' })
    .transform((input) => input ?? []),
});
