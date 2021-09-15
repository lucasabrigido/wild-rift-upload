import * as HttpStatusCodes from 'http-status-codes';

export class HTTPError extends Error {
    constructor(status, error, description, extras) {
        super(description || 'Invalid request');
        this.status = status;
        this.error = error;
        this.description = description;
        this.extras = extras;
    }

    toJSON() {
        return {
            status: this.status,
            error: this.error,
            description: this.description,
            extras: this.extras,
        };
    }
}

export class BadRequestError extends HTTPError {
    constructor(description, { error = 'bad_request', ...rest } = {}) {
        super(HttpStatusCodes.BAD_REQUEST, error, description, rest);
    }
}

export class UnauthorizedError extends HTTPError {
    constructor(description, { error = 'unauthorized', ...rest } = {}) {
        super(HttpStatusCodes.UNAUTHORIZED, error, description, rest);
    }
}
export class PaymentDeniedError extends HTTPError {
    constructor(description, { error = 'payment_denied', ...rest } = {}) {
        super(HttpStatusCodes.PAYMENT_REQUIRED, error, description, rest);
    }
}

export class ForbiddenError extends HTTPError {
    constructor(description, { error = 'forbidden', ...rest } = {}) {
        super(HttpStatusCodes.FORBIDDEN, error, description, rest);
    }
}

export class NotFoundError extends HTTPError {
    constructor(description, { error = 'not_found', ...rest } = {}) {
        super(HttpStatusCodes.NOT_FOUND, error, description, rest);
    }
}

export class ConflictError extends HTTPError {
    constructor(description, { error = 'conflict', ...rest } = {}) {
        super(HttpStatusCodes.CONFLICT, error, description, rest);
    }
}

export class InternalError extends HTTPError {
    constructor(description, { error = 'internal_error', ...rest } = {}) {
        super(HttpStatusCodes.INTERNAL_SERVER_ERROR, error, description, rest);
    }
}

export class NotImplementedError extends HTTPError {
    constructor(description, { error = 'not_implemented', ...rest } = {}) {
        super(HttpStatusCodes.NOT_IMPLEMENTED, error, description, rest);
    }
}
