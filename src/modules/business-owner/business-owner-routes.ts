import { FastifyInstance } from 'fastify';

import { registerBusinewsOwner } from './controllers/register-business-owner';
import { authenticateBusinessOwner } from './controllers/authenticate-business-owner';
import { getBusinessOwnerById } from './controllers/get-business-owner-by-id';

import { registerBusinessOwnerBodySchema } from './schemas/register-business-owner-schema';
import { authenticateBusinessOwnerParamsSchema } from './schemas/authenticate-business-owner-schema';
import { getBusinessOwnerByIdParamsSchema } from './schemas/get-business-owner-by-id-schema';

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

  app.get('/auth/:email', async (request, reply) => {
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

  app.get('/:id', async (request, reply) => {
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
};
