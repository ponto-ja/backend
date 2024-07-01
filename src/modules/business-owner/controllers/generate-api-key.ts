import { randomUUID } from 'node:crypto';
import { app } from '@/app';
import { prisma } from '@/infra/database/prisma/client';
import { getItemFromDynamoDB } from '@/infra/database/dynamodb/helpers/get-item';
import { putItemOnDynamoDB } from '@/infra/database/dynamodb/helpers/put-item';

type GenerateAPIKeyInput = {
  id: string;
  email: string;
};

type GenerateAPIKeyOutput = {
  data: {
    apiKey: string;
  } | null;
  error: unknown | null;
  code:
    | 'GENERATED_API_KEY'
    | 'INVALID_CREDENTIAL'
    | 'API_KEY_ALREADY_EXISTS'
    | 'UNEXPECTED_ERROR';
};

export const generateAPIKey = async ({
  id,
  email,
}: GenerateAPIKeyInput): Promise<GenerateAPIKeyOutput> => {
  try {
    const businessOwner = await prisma.businessOwner.findUnique({
      where: {
        id,
        email,
      },
      select: {
        id: true,
      },
    });

    if (!businessOwner) {
      return {
        data: null,
        error: null,
        code: 'INVALID_CREDENTIAL',
      };
    }

    const apiKeyExists = await getItemFromDynamoDB({
      table: 'APIKeys',
      key: 'business_owner_id',
      value: id,
    });

    if (apiKeyExists) {
      return {
        data: null,
        error: null,
        code: 'API_KEY_ALREADY_EXISTS',
      };
    }

    const apiKey = randomUUID();

    const token = app.jwt.sign({ id, email });

    await putItemOnDynamoDB({
      table: 'APIKeys',
      record: {
        business_owner_id: {
          S: id,
        },
        api_key: {
          S: apiKey,
        },
        payload: {
          S: token,
        },
        created_at: {
          S: new Date().toISOString(),
        },
      },
    });

    return {
      data: {
        apiKey,
      },
      error: null,
      code: 'GENERATED_API_KEY',
    };
  } catch (error) {
    return {
      data: null,
      error,
      code: 'UNEXPECTED_ERROR',
    };
  }
  //TODO [x]: check if exists business owner with id and email provided
  //TODO [x]: check if already exists a api key on dynamoDB for the business owner by id
  //TODO [x]: generate uuid -> api key
  //TODO [x]: generate JWT token -> payload with business owner id, and email
  //TODO [x]: save on dynamodb : fields -> business_owner_id | api_key | payload (jwt token) | created_at (string)
  //TODO [x]: return api key
};
