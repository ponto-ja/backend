import type { FastifyReply, FastifyRequest } from 'fastify';
import { checkAPIKeySchema } from '../schemas/check-api-key-schema';
import { prisma } from '@/infra/database/prisma/client';
import { app } from '@/app';
import { scanOnDynamoDB } from '@/infra/database/dynamodb/helpers/scan';

export const checkAPIKey = async (request: FastifyRequest, reply: FastifyReply) => {
  const { 'api-key': apiKey } = checkAPIKeySchema.parse(request.headers);

  const items = await scanOnDynamoDB({
    table: 'APIKeys',
    filterExpression: '#api_key = :apiKeyValue',
    expressionAttributeNames: {
      '#api_key': 'api_key',
    },
    expressionAttributeValues: {
      ':apiKeyValue': { S: apiKey },
    },
  });

  if (!items) {
    return reply.status(500).send({ code: 'UNEXPECTED_ERROR' });
  }

  if (items.length === 0) {
    return reply.status(400).send({ code: 'INVALID_API_KEY' });
  }

  const [record] = items;

  const businessOwnerId = record.business_owner_id.S;

  const businessOwnerExists = await prisma.businessOwner.findUnique({
    where: {
      id: businessOwnerId,
    },
  });

  if (!businessOwnerExists) {
    return reply.status(400).send({ code: 'INVALID_API_KEY' });
  }

  const token = record.token.S;

  const payload = app.jwt.decode(token!) as Record<string, string>;

  if (payload?.id !== businessOwnerId) {
    return reply.status(400).send({ code: 'INVALID_API_KEY' });
  }

  request.businessOwner = {
    id: businessOwnerId,
  };
};
