import express from 'express';
import swaggerUi from 'swagger-ui-express';

import swaggerDoc from '../../docs/swagger.json';
import config from '../config';

const router = express.Router();

if (config.stage !== 'local') {
    swaggerDoc.schemes = ['https'];
    swaggerDoc.host = config.BASE_API_URL;
}

const swaggerSetup = swaggerUi.setup(swaggerDoc);

router.get('/index.html', swaggerSetup);
router.use('/', swaggerUi.serve);
router.get('/', swaggerSetup);

export default router;

/**
 * @swagger
 * responses:
 *   EmptySuccess:
 *     description: Operação realizada com sucesso
 *   BadRequest:
 *     description: Requisição inválida
 *     schema:
 *       $ref: '#/definitions/Error'
 *   NotFound:
 *     description: Recurso não encontrado
 *     schema:
 *       $ref: '#/definitions/Error'
 *   Unauthorized:
 *     description: Agente não autenticado (credenciais ausentes ou inválidas)
 *     schema:
 *       $ref: '#/definitions/Error'
 *   Forbidden:
 *     description: Agente não autorizado (crendenciais válidas, mas sem direitos necessários)
 *     schema:
 *       $ref: '#/definitions/Error'
 *   Conflict:
 *     description: Recurso já existe
 *     schema:
 *       $ref: '#/definitions/Error'
 *   Unexpected:
 *     description: Erro inesperado
 *     schema:
 *       $ref: '#/definitions/Error'
 */

/**
 * @swagger
 * definitions:
 *   Error:
 *     type: object
 *     properties:
 *       error:
 *         type: string
 *       error_description:
 *         type: string
 */
