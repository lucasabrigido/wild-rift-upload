import serverless from 'serverless-http';

import config from '../api/config';
import app from '../api/app';

export const handler = async (event, context) => {
    const serverlessHandler = serverless(app, { basePath: '/wild-rift-upload' });

    if (config.debug) {
        console.log(JSON.stringify({ event }, null, 2));
        console.log(JSON.stringify({ context }, null, 2));
    }

    const response = await serverlessHandler(event, context);

    if (config.debug) {
        console.log(JSON.stringify({ response }, null, 2));
    }

    if (response.statusCode >= 500) {
        console.log('error -->');
        console.log(JSON.stringify({ event, context, response}, null, 2))
    }

    return response;
};

