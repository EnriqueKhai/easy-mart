import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { Database } from '../../src/apis/dynamo_db';
import { Table, Schema } from '../../src/databases/default';
import { ProductItem, ProductKey } from '../../src/schemas/product';


// local DynamoDB instances
const configs = { endpoint: 'http://localhost:8000' };
const sdk = DynamoDBDocument.from( new DynamoDB(configs) );
const ddb = new Database<Schema>(configs)


// test objects
const tableName = Table.PRODUCTS;
const key: ProductKey = { id: 'ITEM_001' }
const item: ProductItem = { ...key, 'name': 'Fuji Apple', 'price': 1.50, 'stock': 351 }
const updates: Record<string, any> = { 'stock': 244, 'origin': { 'region': 'APAC', 'country': 'Japan' }}


it('should insert item into table', async () => {
  await ddb.put(Table.PRODUCTS, item);
  const { Item } = await sdk.get({ TableName: tableName, Key: key });
  expect(Item).toEqual(item);
});


it('should fetch item from table', async () => {
  await sdk.put({ TableName: tableName, Item: item });
  const Item = await ddb.get(tableName, key);
  expect(Item).toEqual(item);
});


it('should delete item from table', async () => {
  await sdk.put({ TableName: tableName, Item: item });
  await ddb.delete(tableName, key);
  const { Item } = await sdk.get({ TableName: tableName, Key: key });
  expect(Item).toEqual(undefined);
});


it('should update item in table', async () => {
  await sdk.put({ TableName: tableName, Item: item });
  await ddb.update(tableName, key, updates);
  const { Item } = await sdk.get({ TableName: tableName, Key: key });
  expect(Item).toEqual({ ...item, ...updates});
});
