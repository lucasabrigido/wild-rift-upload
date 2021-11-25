import AWS from 'aws-sdk';

const _module = 'sqs';

export default class QueueService {
    constructor({url, groupId, debug}) {
        this._url = url;
        this._groupId = groupId;
        this._debug = debug;
    }

    async sendMessage(params) {
        params = {
            MessageGroupId: this._groupId,
            QueueUrl: this._url,
            ...params,
        };
        if (typeof params.MessageBody !== 'string') {
            params.MessageBody = JSON.stringify(params.MessageBody, null, this._debug ? 2 : undefined);
        }
        if (this._debug) {
            console.log(JSON.stringify({module: _module, function: 'sendMessage', params}, null, 2));
        }

        let result, hasError = false;
        try {
            result = await sqs.sendMessage(params).promise();
            return result;
        } catch (e) {
            result = e;
            hasError = true;
            throw e;
        } finally {
            if (this._debug || hasError) {
                console.log(JSON.stringify({module: _module, function: 'sendMessage', result}, null, 2));
            }
        }
    }
}

const sqs = new AWS.SQS({apiVersion: '2012-11-05'});