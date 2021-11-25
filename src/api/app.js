import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import 'express-async-errors';

import config from './config';
import exceptions from './middlewares/exceptions';
import unknownRoute from './middlewares/unknown-route';
import noCacheControl from './middlewares/no-cache-control';
import tokenDecoder from './middlewares/token-decoder';
import normalizeLanguage from './middlewares/normalize-language';

import upload, {routerFile} from './upload/route';
import docs from './routes/doc';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(noCacheControl);
app.use(normalizeLanguage);
app.use(tokenDecoder(config.debug));

if (['local', 'dev'].includes(config.stage)) {
    app.use('/docs', docs);
}
app.use('/upload', upload);
app.use('/file', routerFile);

app.use(unknownRoute);
app.use(exceptions(config.debug));

export default app;
