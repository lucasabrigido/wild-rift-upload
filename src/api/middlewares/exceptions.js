import { INTERNAL_SERVER_ERROR, BAD_REQUEST } from 'http-status-codes';

export default (debug = false) => async (err, req, res, _next) => {
    const status = err.status || INTERNAL_SERVER_ERROR;
    let response = {
        error: err.error || err.name,
        error_description: err.description || err.message,
    };

    if (status >= BAD_REQUEST || debug) {
        console.log(JSON.stringify(response, null, 2));
    }

    if (status >= INTERNAL_SERVER_ERROR && !debug) {
        response = {
            error: 'InternalServerError',
            error_description: 'Erro interno no servidor',
        };
    }

    res.status(status).send(response);
};
