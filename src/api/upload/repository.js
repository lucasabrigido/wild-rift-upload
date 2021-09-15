import DynamoClient from '../utils/dynamoClient';

export default class Repository {
    static config(cfg) {
        return new Repository(
            new DynamoClient({debug: cfg.debug}),
            cfg.dynamoDbUploadTable,

        );
    }
    async retrieve(id) {
        const {Item} = await this._dc.get({
            TableName: this._tableName,
            Key: {id},
        });
        return Item;
    }

    async put(item) {
        await this._dc.put({
            TableName: this._tableName,
            Item: item,
        });
        return item;
    }

    constructor(dc, tableName,) {
        this._dc = dc;
        this._tableName = tableName;
    }
}
