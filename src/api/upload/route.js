import express from 'express';
import {OK, MOVED_TEMPORARILY} from 'http-status-codes';

import {SchemaCreateUpload, SchemaUploadSave} from './models';
import Service from './service';
import config from '../config';
import validation from '../middlewares/validation';

const router = express.Router();
export const routerFile = express.Router();

router.post('/save', validation(SchemaUploadSave), async(req, res) => {
    res.status(OK).send(await service.add(req.body));
});

router.post('/', validation(SchemaCreateUpload), async(req, res) => {
    res.status(OK).send(await service.upload(req.body));
});

routerFile.get('/:folder/:key', async(req, res) => {
    let location = await service.get(req.params.folder, req.params.key);
    res.removeHeader('Pragma');
    res.setHeader('Cache-Control', `private, max-age=${config.expires - 60 || 180}`);
    res.setHeader('Location', location);
    res.redirect(MOVED_TEMPORARILY, location);
});

const service = Service.config(config);

export default router;
