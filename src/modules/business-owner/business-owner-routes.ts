import { FastifyInstance } from 'fastify';
import { registerBusinewsOwner } from './controllers/register-business-owner';
import { registerBusinessOwnerBodySchema } from './schemas/register-business-owner-schema';

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
};
