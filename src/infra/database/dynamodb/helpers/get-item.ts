import { GetItemCommand } from '@aws-sdk/client-dynamodb';
import { dynamoDB } from '../client';

type GetItemFromDynamoDBParams = {
  table: string;
  key: string;
  value: string;
};

export const getItemFromDynamoDB = async ({
  table,
  key,
  value,
}: GetItemFromDynamoDBParams) => {
  const command = new GetItemCommand({
    TableName: table,
    Key: {
      [key]: {
        S: value,
      },
    },
  });
  const data = await dynamoDB.send(command);

  return data.Item;
};
