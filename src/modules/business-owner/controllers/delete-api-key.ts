import { deleteItemFromDynamoDB } from '@/infra/database/dynamodb/helpers/delete-item';

type DeleteAPIKeyInput = {
  businessOwnerId: string;
};

type DeleteAPIKeyOutput = {
  error: unknown | null;
  code: 'DELETED' | 'INVALID_API_KEY' | 'UNEXPECTED_ERROR';
};

export const deleteAPIKey = async ({
  businessOwnerId,
}: DeleteAPIKeyInput): Promise<DeleteAPIKeyOutput> => {
  try {
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
