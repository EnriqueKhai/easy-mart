import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { BaseSchema } from "../schemas/base";


const parse = (updates: Record<string, any>): [string, Record<string, any>, Record<string, any>] => {
    const expression: string[] = []
    const names: Record<string, any> = {}
    const values: Record<string, any> = {}
    let i = 0
    for (const key in updates) {
        expression.push(`#${i} = :${i}`)
        names[`#${i}`] = key
        values[`:${i}`] = updates[key]
        i += 1
    }
    return  [ 'SET ' + expression.join(', '), names, values ]
}


type KeyOf<T> = keyof T & string


export class Database<S extends Record<string, BaseSchema>> {
    private client: DynamoDBDocument

    constructor(configs: Record<string, string>) {
        let ddb = new DynamoDB(configs)
        this.client = DynamoDBDocument.from(ddb)
    }

    async put<T extends KeyOf<S>>(table: T, item: S[T]['item']): Promise<void> {
        await this.client.put({ TableName: table, Item: item })
    }

    async get<T extends KeyOf<S>>(table: T, key: S[T]['key']): Promise<S[T]['item']>{
        const { Item } = await this.client.get({ TableName: table, Key: key })
        return Item as S[T]['item']
    }

    async delete<T extends KeyOf<S>>(table: T, key: S[T]['key']): Promise<void> {
        await this.client.delete({ TableName: table, Key: key });
    }

    async update<T extends KeyOf<S>>(table: T, key: S[T]['key'], updates: Record<string, any>): Promise<void> {
        const [ expression, names, values ] = parse(updates)
        await this.client.update({
            TableName: table,
            Key: key,
            UpdateExpression: expression,
            ExpressionAttributeNames: names,
            ExpressionAttributeValues: values
        })
    }
}
