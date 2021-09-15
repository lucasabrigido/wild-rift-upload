import Axios from 'axios';
import qs from 'qs';

import { maskedData } from './JSONUtils';

export default function axios({debug, ...config}) {
    const result = Axios.create(config);
    result.interceptors.request.use(stringifyBody);
    result.interceptors.request.use(requestLogger(debug));
    result.interceptors.response.use(responseLogger(debug), rejectLogger(debug));
    return result;
}

function requestLogger(debug) {
    return function (config) {
        if (debug) {
            let {method, baseURL, url, data, headers, params: query, auth} = config;
            const {common, delete: del, get, head, post, put, patch, ...rest} = headers;
            const _headers = {
                ...common,
                ...({delete: del, get, head, post, put, patch}[method]),
                ...rest,
            };
            console.log(`Request: ${JSON.stringify({
                method: method.toUpperCase(),
                baseURL,
                url,
                query,
                headers: _headers,
                auth,
                data: maskedData(data),
            }, null, 2)}`);
        }
        return config;
    };
}

function responseLogger(debug) {
    return function (resp) {
        if (debug) {
            const {status, statusText, headers, data} = resp;
            console.log(`Response: ${JSON.stringify({
                status,
                statusText,
                headers,
                data: maskedData(data),
            }, null, 2)}`);
        }
        return resp;
    };
}

function rejectLogger(debug) {
    return function (error) {
        if (error.response?.config) {
            error.response.config.data = maskedData(error.response.config.data);
        }
        if (debug) {
            let _error = error;
            if (_error.response) {
                _error = {
                    ..._error.response,
                    request: undefined,
                };
            }
            console.error(JSON.stringify(_error, null, 2));
        }
        return Promise.reject(error);
    };
}

function stringifyBody(config) {
    if (config.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
        config.data = qs.stringify(config.data);
    }
    return config;
}
