import redis from 'promise-redis';

class CacheService {
    static config(cfg) {
        return new CacheService(
            redis().createClient(cfg.cachePort, cfg.cacheHost),
            cfg.debug,
        );
    }

    async set(...args) {
        return await this._cache.set(...args);
    }

    async get(...args) {
        return await this._cache.get(...args);
    }

    async expire(...args) {
        return await this._cache.expire(...args);
    }

    async del(...args) {
        return await this._cache.del(...args);
    }

    constructor(redis, debug = false) {
        this._cache = proxyCache(redis, debug);
    }
}

function proxyCache(targetManager, debug) {
    return new Proxy(targetManager, {
        get (target, name) {
            return async function (...args) {
                debug && console.log(`Cache Service [${name}] Request -> `, args);
                if (name === 'set') {
                    args[1] = JSON.stringify(args[1]);
                }
                const result = await target[name](...args);
                debug && console.log(`Cache Service [${name}] Response -> `, result);
                if (name === 'get' && result) {
                    return JSON.parse(result);
                }
                return result;
            };
        },
    });
}

export default CacheService;

export const generateKeys = {
    retrieveActionsPlan: (id) => `FebracisTools-Retrieve-ActionsPlan-${id}`,
    retrieveAction: (id) => `FebracisTools-Retrieve-Actions-${id}`,
    listActionPlanByGoalIdCycleId: (cycleId, goalId) => `FebracisTools-List-ActionsPlan-${cycleId}-${goalId}`,
    listActionsByActionPlanId: (id, status = 'not') => `FebracisTools-List-Actions-${id}-${status}`,
    listPhotoWallByCycleId: (cycleId, id) => `FebracisTools-List-PhotoWall-ByCycleId-${cycleId}-${id}`,
    listPhotoWallByGoalIdCycleId: (cycleId, goalId, id) => `FebracisTools-List-PhotoWall-ByGoalIdCycleId-${cycleId}-${goalId}-${id}`,
};
