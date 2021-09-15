import AWS from 'aws-sdk';
import {v4 as uuid} from 'uuid';
import Mime from 'mime';

import Repository from './repository';
import { BadRequestError } from '../utils/errors';

const defaultProps = {
    name: '',
    about: '',
    email: '',
    birthdate: '',
    acceptTerms: false,
};
export default class UploadService {
    static config(cfg) {
        return new UploadService(
            new AWS.S3({ s3ForcePathStyle: true }),
            cfg.bucketName,
            'wild-rift',
            cfg.BASE_API_URL,
            cfg.expires,
            Repository.config(cfg),
        );
    }

    async upload({mime, name}) {
        const extension = Mime.getExtension(mime);
        if (!extension) {
            throw new BadRequestError(`Unknown extension for mime: ${mime}`);
        }
        let fileName = `${name ? `${name}-` : ''}${uuid()}.${extension}`;

        const ref = `${this._folder}/${fileName}`;

        const url = this._s3.getSignedUrl('putObject', {
            Bucket: this._bucket,
            Key: ref,
            Expires: this._expires,
            ContentType: mime,
        });

        return {get: this._baseUrl + '/v2/wild-rift-upload/file/' + ref , put: url};
    }

    async get(Folder, Key) {
        const url = this._s3.getSignedUrl('getObject', {
            Bucket: this._bucket,
            Key: `${Folder}/${Key}`,
            Expires: this._expires,
        });
        return url;
    }

    async add(item) {
        const now = new Date().toISOString();
        return await this._repository.put({
            ...defaultProps,
            ...item,
            id: uuid(),
            createdAt: now,
            updateAt: now,
        });
    }

    constructor(s3, bucket, folder, baseUrl, expires = 180, repository) {
        this._s3 = s3;
        this._bucket = bucket;
        this._folder = folder;
        this._baseUrl = baseUrl;
        this._expires = expires;
        this._repository = repository;
    }
}
