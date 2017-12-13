const authConfig = require('../../config/auth.config');
const authUtils = require('../../utils/auth');
const serviceMap = require('../../services/services.v1');
const InkError = require('../../common/models/ink-errors');
const Res = require('../../common/models/responses');
const userService = require('../../services/users.v1');
const toRegex = require('path-to-regexp');

/**
 * verify the `exec` (owner) field in the payload
 * 
 * @param {*} endpoint 
 * @param {*} requestedPath 
 * @param {*} method            requesting method
 * @param {*} sub               user id (extracted from `acc_token`'s payload)
 * @return {Promise<void>}      resolving undefined
 */
async function verifyExec(endpoint, requestedPath, method, sub) {
    if (!endpoint.exec) { return; }

    let keys = [ ]; 
    let rex = toRegex(endpoint.path, keys);
    let result = rex.exec(requestedPath).slice(1);

    let promises = endpoint.exec.map(async ({ key, model: modelName, methods }) => {
        if (methods && !methods.includes(method)) { return; }

        let pk = +result[ keys.map((k) => k.name).indexOf(key) ];
        let service = serviceMap.get(modelName);
        if (!pk || !service) {
            // programming error
            throw new Error('Auth definition has errors.');
        }

        authUtils.verifyOwner(await service.retrieve(pk), sub);
    });
    // wait for all parallel verifications done
    await Promise.all(promises);
}

/**
 * verify payload of the access_token, and add the auth info to `req`
 * 
 * @return {Promise<void>} resolving undefined
 */
async function verifyPayload(payload, req) {
    let requestedPath = req.baseUrl + req.path;
    let endpoint = payload.endpoints.find(({ path }) => toRegex(path).test(requestedPath));

    // verify auth exists and http method
    if (endpoint && endpoint.methods.includes(req.method)) {
        // verify ownership
        await verifyExec(endpoint, requestedPath, req.method, payload.sub);

        let auth = {
            _user: null,
            // user id (sync)
            sub: payload.sub,
            // note this will return a promise (async!)
            get user() {
                return ( async () => this._user || await this.retrieve() )();
            },
            retrieve: async function() {
                this._user = await userService.retrieveV2({ id: this.sub });
                return this._user;
            }
        };
        if (authConfig.eagerLoading) {
            await auth.retrieve();
        }

        req.auth = auth;
    } else {
        // client is not authorized for the requested path
        throw new InkError.NoAuthorization();
    }
}

module.exports = async function(req, res, next) {
    try {
        let accToken = req.cookies['access_token'];
        let payload = await authUtils.verifyToken(accToken, 'access_token', authConfig.publicKey);
        await verifyPayload(payload, req);
        // authorization is all good
        next();
    } catch (err) {
        if (err instanceof InkError.NoAuthorization) {
            let resPayload = new Res.Forbidden();
            res.status(resPayload.status).json(resPayload);
        } else {
            // unknown error, let express handle
            next(err);
        }
    }
}
