import fs from 'fs';
import {promisify} from 'util';
import swaggerJSDoc from 'swagger-jsdoc';

import pack from '../package';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

(async function saveDocFile() {
    const options = {
        swaggerDefinition: {
            openapi: '3.0.0',
            components: {},
            info: {
                description:  'Wild Rift Upload API',
                version: pack.version,
                title: 'Wild Rift Upload API',
            },
            basePath: '/v2',
            host: 'http://localhost:3000',
            schemes: ['http'],
            securityDefinitions: {
                Bearer: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'Authorization',
                },
            },
        },
        apis: ['src/api/**/*.js'],
    };
    let oldDoc;
    const docs = JSON.stringify(swaggerJSDoc(options), null, 2);
    try {
        oldDoc = await readFile('swagger.json', 'utf8');
    } catch (_e) {
        oldDoc = null;
    }
    if (oldDoc !== docs) {
        await writeFile(__dirname + '/../src/docs/swagger.json', docs);
    }
})();
