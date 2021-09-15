import AWS from 'aws-sdk';
import stackTrace from 'stack-trace';
import config from '../config';

async function execute(dynamoClient, params) {
    const trace = stackTrace.get();
    const fname = trace[1].getFunctionName();
    const dc = dynamoClient._dc;
    try {
        if (config.debug) {
            console.log(`${fname}:`, JSON.stringify(params, null, 2));
        }
        let result = await dc[fname](params).promise();
        if (config.debug) {
            console.log('result:', JSON.stringify(result, null, 2));
        }
        return result;
    } catch (e) {
        console.log('error:', JSON.stringify(e, null, 2));
        throw e;
    }
}
export default class DynamoClient {
    constructor(props) {
        this._dc = new AWS.DynamoDB.DocumentClient(props ? props : null);
    }
    /**
   * @param {AWS.DynamoDB.DocumentClient.PutItemInput} params
   * @returns {Promise<AWS.DynamoDB.DocumentClient.PutItemOutput>}
   */
    put(params) {
        return execute(this, params);
    }
    /**
   * @param {AWS.DynamoDB.DocumentClient.GetItemInput} params
   * @returns {Promise<AWS.DynamoDB.DocumentClient.GetItemOutput>}
   */
    get(params) {
        return execute(this, params);
    }
    /**
   * @param {AWS.DynamoDB.DocumentClient.UpdateItemInput} params
   * @returns {Promise<AWS.DynamoDB.DocumentClient.UpdateItemOutput>}
   */
    update(params) {
        return execute(this, params);
    }
    /**
   * @param {AWS.DynamoDB.DocumentClient.DeleteItemInput} params
   * @returns {Promise<AWS.DynamoDB.DocumentClient.DeleteItemOutput>}
   */
    delete(params) {
        return execute(this, params);
    }
    /**
   * @param {AWS.DynamoDB.DocumentClient.QueryInput} params
   * @returns {Promise<AWS.DynamoDB.DocumentClient.QueryOutput>}
   */
    query(params) {
        return execute(this, params);
    }
    /**
   * @param {AWS.DynamoDB.DocumentClient.ScanInput} params
   * @returns {Promise<AWS.DynamoDB.DocumentClient.ScanOutput>}
   */
    scan(params) {
        return execute(this, params);
    }
    /**
   * @param {AWS.DynamoDB.DocumentClient.BatchGetItemInput} params
   * @returns {Promise<AWS.DynamoDB.DocumentClient.BatchGetItemOutput>}
   */
    batchGet(params) {
        return execute(this, params);
    }
    /**
   * @param {AWS.DynamoDB.DocumentClient.BatchWriteItemInput} params
   * @returns {Promise<AWS.DynamoDB.DocumentClient.BatchWriteItemOutput>}
   */
    batchWrite(params) {
        return execute(this, params);
    }
}
