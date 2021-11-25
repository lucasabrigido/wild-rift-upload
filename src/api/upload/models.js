import Joi from '@hapi/joi';
import {mimes} from '../utils/constants';

export const SchemaCreateUpload = Joi.object().keys({
    mime: Joi.string().valid(...mimes).required(),
    name: Joi.string().trim().optional(),
});

export const Photos = Joi.object().keys({
    name: Joi.string().required(),
    status: Joi.string().required(),
    mime: Joi.string().valid(...mimes).required(),
    url: Joi.string().required(),
});

export const SchemaUploadSave = Joi.object().keys({
    name: Joi.string().trim().required(),
    birthdate: Joi.string().required(),
    about: Joi.string().allow(null, '').optional(),
    email: Joi.string().trim().required(),
    photos: Joi.array().items(Photos).min(1).required(),
    acceptTerms: Joi.boolean().required(),
});

/**
 * @swagger
 * components:
 *   schemas:
 *     SchemaCreateUpload:
 *       type: object
 *       properties:
 *         mime:
 *           type: string
 *           enum: [text/plain, text/html, text/css, text/javascript, image/gif, image/png, image/jpeg, image/bmp, image/webp, audio/midi, audio/mpeg, audio/webm, audio/ogg, audio/wav, video/webm, video/ogg, application/octet-stream, application/pkcs12, application/vnd.mspowerpoint, application/xhtml+xml, application/xml,  application/pdf]
 *     Photos:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         status:
 *           type: string
 *     SchemaUploadSave:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         age:
 *           type: string
 *         about:
 *           type: string
 *         acceptTerms:
 *           type: boolean
 *         email:
 *           type: string
 *         photos:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Photos'
 *     SchemaResponseUpload:
 *       type: object
 *       properties:
 *         put:
 *           type: string
 *         get:
 *           type: string
*/

/**
 * @swagger
 *   /upload/:
 *     post:
 *       tags:
 *         - upload
 *       summary: faz a request para pegar uma url de put (para subir a imagem) e uma url de get (para ver a imagem)
 *       security:
 *         - Bearer: []
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SchemaCreateUpload'
 *       responses:
 *         200:
 *           description: Operação realizada com sucesso
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/SchemaResponseUpload'
 *         default:
 *           $ref: "#/responses/Unexpected"
 */

/**
 * @swagger
 *   /upload/save:
 *     post:
 *       tags:
 *         - upload
 *       summary: sava a imagem no dynamodb com algumas informações de quem enviou
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SchemaUploadSave'
 *       responses:
 *         200:
 *           description: Operação realizada com sucesso
 *           content:
 *             application/json:
 *               schema:
 *                 {}
 *         default:
 *           $ref: "#/responses/Unexpected"
 */
