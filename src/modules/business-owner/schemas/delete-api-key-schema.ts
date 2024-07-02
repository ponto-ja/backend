import { z } from 'zod';

export const deleteAPIKeyHeadersSchema = z.object({
  'api-key': z
    .string({
      required_error: 'api-key is a required header',
      invalid_type_error: 'api-key must be a string',
    })
    .min(1, { message: 'api-key is a required header' }),
});
