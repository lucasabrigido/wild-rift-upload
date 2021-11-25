module.exports = {
    debug: ['true', true].includes(process.env.DEBUG),
    stage: process.env.STAGE,
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    BASE_API_URL: process.env.BASE_API_URL,
    serviceName: process.env.SERVICE_NAME,
    bucketName: process.env.WILD_RIFT_UPLOAD_BUCKET_NAME,
    bucketArn: process.env.WILD_RIFT_UPLOAD_BUCKET_ARN,
    expires: parseInt(process.env.EXPIRES),
    dynamoDbUploadTable: process.env.DYNAMODB_TABLE_UPLOAD_PLAN,
    
};
