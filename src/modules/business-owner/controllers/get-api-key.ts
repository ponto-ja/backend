import { getItemFromDynamoDB } from '@/infra/database/dynamodb/helpers/get-item';

type GetAPIKeyInput = {
  businessOwnerId: string;
};

type GetAPIKeyOutput = {
  data: string | null;
  error: unknown | null;
  code: 'API_KEY_FOUND' | 'API_KEY_NOT_FOUND' | 'UNEXPECTED_ERROR';
};

export const getAPIKey = async ({
  businessOwnerId,
}: GetAPIKeyInput): Promise<GetAPIKeyOutput> => {
  try {
    const dataOnDynamoDB = await getItemFromDynamoDB({
      table: 'APIKeys',
      key: 'business_owner_id',
      value: businessOwnerId,
    });

    if (!dataOnDynamoDB) {
      return {
        data: null,
        error: null,
        code: 'API_KEY_NOT_FOUND',
      };
    }

    return {
      data: dataOnDynamoDB.api_key.S!,
      error: null,
      code: 'API_KEY_FOUND',
    };
  } catch (error) {
    return {
      data: null,
      error,
      code: 'UNEXPECTED_ERROR',
    };
  }
};
