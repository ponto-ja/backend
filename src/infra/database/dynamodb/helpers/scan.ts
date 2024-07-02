import { AttributeValue, ScanCommand } from '@aws-sdk/client-dynamodb';
import { dynamoDB } from '../client';

type ScanOnDynamoDBInput = {
  table: string;
  filterExpression: string;
  expressionAttributeNames: Record<string, string> | undefined;
  expressionAttributeValues: Record<string, AttributeValue> | undefined;
};

export const scanOnDynamoDB = async ({
  table,
  filterExpression,
  expressionAttributeNames,
  expressionAttributeValues,
}: ScanOnDynamoDBInput) => {
  const command = new ScanCommand({
    TableName: table,
    FilterExpression: filterExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
  });

  const response = await dynamoDB.send(command);

  return response.Items;
};
