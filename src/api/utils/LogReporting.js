const LogTypes = {
    DEBUG: 'log',
    INFO: 'log',
    WARN: 'warn',
    ERROR: 'error',
    FATAL: 'error',
};

const Modules = {
    axios: {
        verboseField: 'verboseAxios',
        parseParams: (req) => ({
            method: req.method,
            url: req.url,
            headers: getHeaders(req.headers),
            body: getBody('application/json', undefined, req.data),
        }),
        parseResult: (result) => ({
            status: result.status,
            headers: getHeaders(result.headers),
            body: getBody(
                result.headers['Content-Type'] || result.headers['content-type'],
                result.headers['Content-Length'] || result.headers['content-length'],
                result.data,
            ),
        }),
    },
    mysql: {
        verboseField: 'verboseMysql',
    },
    dynamodb: {
        verboseField: 'verboseDynamoDB',
    },
    cognito: {
        verboseField: 'verboseCognito',
    },
    redis: {
        verboseField: 'verboseRedis',
        parseAction: cmd => cmd ? cmd.toString().toUpperCase() : cmd,
        parseParams: args => args ? args.map(a => a && a.length > 128 ? '<<<STR TOO LONG>>>' : a) : undefined,
        parseResult: result => !result ? typeof result : result.length > 32 ? `<<STRLEN ${result.length}>>>` : result,
    },
    s3: {
        verboseField: 'verboseS3',
        parseParams: p => ({ ...p, Body: p.Body ? '<<<BYTES>>' : undefined }),
        parseResult: result => typeof result !== 'object' ? result : ({ ...result, Body: result.Body ? '<<<BYTES>>' : undefined }),
    },
};

export class LogReporting {
    constructor({
        verbose,
        verboseApiGatewayEvent,
        verboseApiGatewayResponse,
        verboseApiGatewaySummary,
        verboseContext,
        verboseRedis,
        verboseMysql,
        verboseDynamoDB,
        verboseAxios,
        verboseS3,
        verboseCognito,
    } = {
        verbose: parseBoolean(process.env.VERBOSE || false),
        verboseApiGatewayEvent: parseBoolean(process.env.VERBOSE_API_GATEWAY_EVENT || process.env.VERBOSE || false),
        verboseApiGatewayResponse: parseBoolean(process.env.VERBOSE_API_GATEWAY_RESPONSE || process.env.VERBOSE || false),
        verboseApiGatewaySummary: parseBoolean(process.env.VERBOSE_API_GATEWAY_SUMMARY || process.env.VERBOSE || false),
        verboseContext: parseBoolean(process.env.VERBOSE_CONTEXT || process.env.VERBOSE || false),
        verboseRedis: parseBoolean(process.env.VERBOSE_REDIS || process.env.VERBOSE || false),
        verboseMysql: parseBoolean(process.env.VERBOSE_MYSQL || process.env.VERBOSE || false),
        verboseDynamoDB: parseBoolean(process.env.VERBOSE_DYNAMODB || process.env.VERBOSE || false),
        verboseAxios: parseBoolean(process.env.VERBOSE_AXIOS || process.env.VERBOSE || false),
        verboseS3: parseBoolean(process.env.VERBOSE_S3 || process.env.VERBOSE || false),
        verboseCognito: parseBoolean(process.env.VERBOSE_COGNITO || process.env.VERBOSE || false),
    }) {
        this._flags = {
            verbose,
            verboseApiGatewayEvent,
            verboseApiGatewayResponse,
            verboseApiGatewaySummary,
            verboseContext,
            verboseRedis,
            verboseMysql,
            verboseDynamoDB,
            verboseAxios,
            verboseS3,
            verboseCognito,
        };
    }

    get flags() {
        return this._flags;
    }

    set flags(value) {
        this._flags = value;
    }

    lambdaContext(context) {
        this._context = {
            awsRequestId: context.awsRequestId,
            context: {
                ...context,
                callbackWaitsForEmptyEventLoop: undefined,
                logGroupName: undefined,
                functionVersion: undefined,
                invokedFunctionArn: undefined,
                functionName: undefined,
                awsRequestId: undefined,
            },
        };

        if (this._flags.verboseContext) {
            _log({ context: this._context });
        }
    }

    apiGatewayEvent(event) {
        let claims = event.requestContext && event.requestContext.authorizer && event.requestContext.authorizer.claims ?
            JSON.parse(event.requestContext.authorizer.claims) :
            undefined;

        this._apiGatewayEvent = {
            requestId: event.requestContext.requestId,
            userId: claims ? claims.id : undefined,
            method: event.httpMethod,
            path: event.path,
            request: {
                headers: getHeaders(event.headers),
                query: event.queryStringParameters ? event.queryStringParameters : undefined,
                claims,
                body: getBody(
                    event.headers['Content-Type'] || event.headers['content-type'],
                    event.headers['Content-Length'] || event.headers['content-length'],
                    event.body,
                ),
            },
        };

        if (this._flags.verboseApiGatewayEvent) {
            _log({ event: this._apiGatewayEvent });
        }
    }

    apiGatewayResponse(response) {
        this._apiGatewayResponse = {
            status: response.statusCode,
            response: {
                headers: getHeaders(response.headers),
                body: getBody(
                    response.headers['Content-Type'] || response.headers['content-type'],
                    response.headers['Content-Length'] || response.headers['content-length'],
                    response.body,
                ),
            },
        };

        if (this._flags.verboseApiGatewayResponse) {
            _log({ response: this._apiGatewayResponse });
        }
    }

    apiGatewaySummary() {
        if (!this._apiGatewayEvent || !this._apiGatewayResponse) {
            console.warn('[LogReporting] apiGatewayEvent ou apiGatewayResponse não foi definido');
            return;
        }

        if (this._flags.verboseApiGatewaySummary) {
            _log({ ...this._apiGatewayEvent, ...this._apiGatewayResponse });
        }
    }

    log(message, type = LogTypes.DEBUG) {
        if (this._flags.verbose) {
            _log(message, type);
        }
    }

    info(message) {
        _log(message, LogTypes.INFO);
    }

    warn(message) {
        _log(message, LogTypes.WARN);
    }

    error(message) {
        _log(message, LogTypes.ERROR);
    }

    fatal(message) {
        _log(message, LogTypes.FATAL);
    }

    start(module, action, params) {
        return _start(this, { module, action, params });
    }

    success(p, result) {
        _end(this, p, { status: 'SUCCESS', result });
    }

    exception(p, error) {
        _end(this, p, { status: 'ERROR', error });
    }
}

export default new LogReporting();

function _log(message, type = LogTypes.DEBUG) {
    console[type](
        !message ? typeof message : typeof message === 'string' ? message : JSON.stringify(message, null, 2)
    );
}

function _start(log, { module, action, params }) {
    const now = new Date();
    const m = Modules[module || 'undefined'];

    if (!m) {
        console.warn(`[LogReporting] módulo ${module || 'undefined'} não suportado`);
        return;
    }

    return {
        _performance: now.getTime(),
        module,
        action: m.parseAction ? m.parseAction(action) : action,
        params: m.parseParams ? m.parseParams(params) : params,
        start: now.toISOString(),
    };
}

function _end(log, p, { status, result, error }) {
    const now = new Date();
    const moduleName = p ? p.module : 'undefined';
    const m = Modules[moduleName];

    if (!m) {
        console.warn(`[LogReporting] módulo ${moduleName} não suportado`);
        return;
    }

    if (log._flags[m.verboseField] === true) {
        _log({
            ...p,
            end: now.toISOString(),
            status,
            result: result ? m.parseResult ? m.parseResult(result) : result : undefined,
            error: error ? m.parseResult ? m.parseResult(error) : error : undefined,
            duration: now.getTime() - p._performance,
            _performance: undefined,
        }, LogTypes.DEBUG);
    }
}

function parseBoolean(value) {
    return value === true || value === 'true';
}

/**
 * @param {string|undefined} contentType
 * @param {number|undefined} contentLength
 * @param {string|undefined} body
 */
function getBody(contentType, contentLength, body) {
    /**
     * IMPORTANTE:
     * -  res.sendStatus(200).end() retorna text/html e o texto 'OK' no body
     *
     * CONTENT_TYPE         BODY            BODY_RESULT
     * application/json     other_type      'Invalid body for application/json'
     * application/json     undefined|null  undefined
     * application/json     string          JSON.parse(body) || '<<<JSON TOO LONG>>>' (use Content-Length)
     * application/json     object          body || '<<<JSON TOO LONG>>>' (use Content-Length)
     * text/xxx             other_type      'Invalid body for text/xxx'
     * text/xxx             undefined|null  undefined
     * text/xxx             string          body || '<<<TEXT TOO LONG>>>' (use Content-Length)
     * x                    *               x
     * undefined|null       undefined|null  undefined
     * undefined|null       *               'Invalid body for no Content-Type'
     */

    if (typeof contentType !== 'string') {
        return typeof body === 'undefined' || body === null ? undefined : 'Invalid body for no Content-Type';
    } else if (contentType.startsWith('application/json')) {
        if (typeof body === 'undefined' || body === null) {
            return undefined;
        }

        if (!['string', 'object'].includes(typeof body)) {
            return 'Invalid body for application/json';
        }

        if (typeof contentLength !== 'number') {
            contentLength = typeof body === 'string' ? body.length : JSON.stringify(body).length;
        }

        if (contentLength > 1024) {
            return '<<<JSON TOO LONG>>>';
        }

        let result;

        try {
            result = typeof body === 'string' ? JSON.parse(body) : { ...body };
            delete result.password;
        } catch {
            return 'Invalid body for application/json';
        }

        return result;
    } else if (contentType.startsWith('text/')) {
        if (typeof body === 'undefined' || body === null) {
            return undefined;
        }

        if (typeof body !== 'string') {
            return `Invalid body for ${contentType}`;
        }

        if (typeof contentLength !== 'number') {
            contentLength = body.length;
        }

        if (contentLength > 128) {
            return '<<<TEXT TOO LONG>>>';
        }

        return body;
    } else {
        return contentType;
    }
}

function getHeaders(headers) {
    let userAgent = headers['User-Agent'] || headers['user-agent'];
    let apiKey = headers['X-Api-Key'] || headers['x-api-key'];

    let temp = apiKey ? {
        'x-api-key': apiKey,
    } : {
        'Location': headers.Location || headers.location,
        'Cache-Control': headers['Cache-Control'] || headers['cache-control'],
        'IsDesktop': headers['CloudFront-Is-Desktop-Viewer'],
        'IsMobile': headers['CloudFront-Is-Mobile-Viewer'],
        'IsSmartTV': headers['CloudFront-Is-SmartTV-Viewer'],
        'IsTablet': headers['CloudFront-Is-Tablet-Viewer'],
        'Country': headers['CloudFront-Viewer-Country'],
        'User-Agent': userAgent && userAgent !== 'Amazon CloudFront' ? userAgent : undefined,
        'X-Forwarded-For': headers['X-Forwarded-For'],
        Origin: headers.Origin || headers.origin,
        Authorization: headers.Authorization || headers.authorization,
    };

    let result = {};

    for (let field in temp) {
        if (typeof temp[field] === 'undefined') {
            continue;
        }

        result[field] = temp[field];
    }

    if (Object.keys(result).length === 0) {
        return undefined;
    }

    return result;
}
