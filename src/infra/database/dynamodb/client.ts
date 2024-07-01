import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

export const dynamoDB = new DynamoDBClient({
  region: process.env.AWS_PROFILE_REGION as string,
  credentials: {
    secretAccessKey: process.env.AWS_PROFILE_SECRET_ACCESS_KEY as string,
    accessKeyId: process.env.AWS_PROFILE_ACCESS_KEY_ID as string,
  },
});
