import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';


// local DynamoDB instance
const configs = { endpoint: 'http://localhost:8000' };
const sdk = DynamoDBDocument.from( new DynamoDB(configs) );


// test objects
const tableName = 'files';
const key = { id: '1' };
const item = { ...key, 'name': 'main.js' }


it('should insert item into table', async () => {
  await sdk.put({ TableName: tableName, Item: item });
  const { Item } = await sdk.get({ TableName: tableName, Key: key });
  expect(Item).toEqual(item);
});


it('should delete item from table', async () => {
  await sdk.put({ TableName: tableName, Item: item });
  await sdk.delete({ TableName: tableName, Key: key });
  const { Item } = await sdk.get({ TableName: tableName, Key: key });
  expect(Item).toEqual(undefined);
});


it('should update item in table', async () => {
  await sdk.put({ TableName: tableName, Item: item });
  await sdk.update({
    TableName: tableName,
    Key: key,
    UpdateExpression: 'SET #1 = :1, #2 = :2',
    ExpressionAttributeNames: {
      '#1': 'name',
      '#2': 'location'
    },
    ExpressionAttributeValues: {
      ':1': 'main.ts',
      ':2': '/home/nick/src/'
    }
  });
  const { Item } = await sdk.get({ TableName: tableName, Key: key });
  expect(Item).toEqual({ ...item, 'name': 'main.ts', 'location': '/home/nick/src/'});
});
