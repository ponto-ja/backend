import { AttributeValue, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { dynamoDB } from '../client';

type PutItemOnDynamoDBInput = {
  table: string;
  record: Record<string, AttributeValue>;
};

export const putItemOnDynamoDB = async ({ table, record }: PutItemOnDynamoDBInput) => {
  const command = new PutItemCommand({
    TableName: table,
    Item: record,
  });

  await dynamoDB.send(command);
};
