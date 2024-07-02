import { app } from '@/app';
import { deleteItemFromDynamoDB } from '@/infra/database/dynamodb/helpers/delete-item';
import { scanOnDynamoDB } from '@/infra/database/dynamodb/helpers/scan';
import { prisma } from '@/infra/database/prisma/client';

type DeleteAPIKeyInput = {
  apiKey: string;
};

type DeleteAPIKeyOutput = {
  error: unknown | null;
  code: 'DELETED' | 'INVALID_API_KEY' | 'UNEXPECTED_ERROR';
};

export const deleteAPIKey = async ({
  apiKey,
}: DeleteAPIKeyInput): Promise<DeleteAPIKeyOutput> => {
  try {
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
      return {
        error: null,
        code: 'UNEXPECTED_ERROR',
      };
    }

    if (items.length === 0) {
      return {
        error: null,
        code: 'INVALID_API_KEY',
      };
    }

    const [record] = items;

    const businessOwnerId = record.business_owner_id.S;

    const businessOwnerExists = await prisma.businessOwner.findUnique({
      where: {
        id: businessOwnerId,
      },
    });

    if (!businessOwnerExists) {
      return {
        error: null,
        code: 'INVALID_API_KEY',
      };
    }

    const token = record.token.S;

    const payload = app.jwt.decode(token!) as Record<string, string>;

    if (payload?.id !== businessOwnerId) {
      return {
        error: null,
        code: 'INVALID_API_KEY',
      };
    }

    await deleteItemFromDynamoDB({
      table: 'APIKeys',
      key: 'business_owner_id',
      value: businessOwnerId,
    });

    return {
      error: null,
      code: 'DELETED',
    };
  } catch (error) {
    return {
      error,
      code: 'UNEXPECTED_ERROR',
    };
  }
};
