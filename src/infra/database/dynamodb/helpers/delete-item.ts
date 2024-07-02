import { DeleteItemCommand } from '@aws-sdk/client-dynamodb';
import { dynamoDB } from '../client';

type DeleteItemFromDynamoDBInput = {
  table: string;
  key: string;
  value: string;
};

export const deleteItemFromDynamoDB = async ({
  table,
  key,
  value,
}: DeleteItemFromDynamoDBInput) => {
  const command = new DeleteItemCommand({
    TableName: table,
    Key: {
      [key]: {
        S: value,
      },
    },
  });

  await dynamoDB.send(command);
};
