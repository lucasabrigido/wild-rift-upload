import AWS from 'aws-sdk';

const TopicArn = process.env.TOPIC_ERROR;

export default class {
    constructor() {
        this._sns = new AWS.SNS();
    }

    async notify({ message, subject }) {
        await this._sns.publish({
            TopicArn,
            Message: getMessage(message),
            Subject: subject,
        }).promise();
    }
}

function getMessage(message) {
    try {
        switch (typeof message) {
            case 'string':
                return message;
            case 'object':
                return JSON.stringify(message, null, 2);
            default:
                throw new Error(`Invalid message type: ${message}`);
        }
    } catch (ex) {
        return ex.message;
    }
};
