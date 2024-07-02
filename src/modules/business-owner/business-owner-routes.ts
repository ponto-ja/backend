import { FastifyInstance } from 'fastify';

import { registerBusinewsOwner } from './controllers/register-business-owner';
import { authenticateBusinessOwner } from './controllers/authenticate-business-owner';
import { getBusinessOwnerById } from './controllers/get-business-owner-by-id';
import { generateAPIKey } from './controllers/generate-api-key';
import { deleteAPIKey } from './controllers/delete-api-key';
import { getAPIKey } from './controllers/get-api-key';

import { registerBusinessOwnerBodySchema } from './schemas/register-business-owner-schema';
import { authenticateBusinessOwnerParamsSchema } from './schemas/authenticate-business-owner-schema';
import { getBusinessOwnerByIdParamsSchema } from './schemas/get-business-owner-by-id-schema';
import { generateAPIKeyBodySchema } from './schemas/generate-api-key-schema';
import { getAPIKeyParamsSchema } from './schemas/get-api-key-schema';

import { checkAPIKey } from '@/common/middlewares/check-api-key';

export const businessOwnerRoutes = async (app: FastifyInstance) => {
  app.post('/register', async (request, reply) => {
    const { firstName, lastName, email } = registerBusinessOwnerBodySchema.parse(
      request.body,
    );

    const { code, error } = await registerBusinewsOwner({ firstName, lastName, email });

    switch (code) {
      case 'CREATED': {
        return reply.status(201).send({ code });
      }

      case 'EMAIL_ALREADY_EXISTS': {
        return reply.status(409).send({ code });
      }

      case 'UNEXPECTED_ERROR': {
        return reply.status(500).send({ error });
      }
    }
  });

  app.get('/auth/:email', { onRequest: [checkAPIKey] }, async (request, reply) => {
    const { email } = authenticateBusinessOwnerParamsSchema.parse(request.params);

    const { code, error } = await authenticateBusinessOwner({ email });

    switch (code) {
      case 'AUTHENTICATED': {
        return reply.status(200).send({ code });
      }

      case 'INVALID_CREDENTIAL': {
        return reply.status(400).send({ code });
      }

      case 'UNEXPECTED_ERROR': {
        return reply.status(500).send({ error });
      }
    }
  });

  app.get('/:id', { onRequest: [checkAPIKey] }, async (request, reply) => {
    const { id } = getBusinessOwnerByIdParamsSchema.parse(request.params);

    const { code, error, data } = await getBusinessOwnerById({ id });

    switch (code) {
      case 'BUSINESS_OWNER_FOUND': {
        return reply.status(200).send(data);
      }

      case 'BUSINESS_OWNER_NOT_FOUND': {
        return reply.status(404).send({ code });
      }

      case 'UNEXPECTED_ERROR': {
        return reply.status(500).send({ error });
      }
    }
  });

  app.post('/api_key/generate', async (request, reply) => {
    const { id, email } = generateAPIKeyBodySchema.parse(request.body);

    const { code, error, data } = await generateAPIKey({ id, email });

    switch (code) {
      case 'GENERATED_API_KEY': {
        return reply.status(201).send({ apiKey: data!.apiKey });
      }

      case 'API_KEY_ALREADY_EXISTS': {
        return reply.status(409).send({ code });
      }

      case 'INVALID_CREDENTIAL': {
        return reply.status(400).send({ code });
      }

      case 'UNEXPECTED_ERROR': {
        return reply.status(500).send({ error });
      }
    }
  });

  app.delete('/api_key', { onRequest: [checkAPIKey] }, async (request, reply) => {
    const { code, error } = await deleteAPIKey({
      businessOwnerId: request.businessOwner.id,
    });

    switch (code) {
      case 'DELETED': {
        return reply.status(200).send({ code });
      }

      case 'INVALID_API_KEY': {
        return reply.status(400).send({ code });
      }

      case 'UNEXPECTED_ERROR': {
        return reply.status(500).send({ error });
      }
    }
  });

  app.get('/:businessOwnerId/api_key', async (request, reply) => {
    const { businessOwnerId } = getAPIKeyParamsSchema.parse(request.params);

    const { code, error, data } = await getAPIKey({
      businessOwnerId,
    });

    switch (code) {
      case 'API_KEY_FOUND': {
        return reply.status(200).send({ apiKey: data });
      }

      case 'API_KEY_NOT_FOUND': {
        return reply.status(404).send({ code });
      }

      case 'UNEXPECTED_ERROR': {
        return reply.status(500).send({ error });
      }
    }
  });
};
