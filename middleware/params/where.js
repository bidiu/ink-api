const ALLOWED_OP_ALIASES = require('../../db/aliases');
const InkError = require('../../common/models/ink-errors');
const Res = require('../../common/models/responses');

const KEY_NAME = '_where';

function validateOneObj(obj, allowedKeys) {
    Object.keys(obj).forEach((k) => {
        let v = obj[k];

        if (!allowedKeys.includes(k)) { throw new InkError.BadReq(); }
        if (v && typeof v === 'object') {
            validateOneObj(v, allowedKeys);
        }
    });
}

/**
 * validation notions:
 *      - not differentiate non-exist and undefined (actually not a value for JSON)
 *      - deem null as a set value (so null is illegal for '_where' - see next one)
 *      - only object type (but cannot be null) is valid for '_where'
 */
module.exports = function(req, res, model) {
    let where = req.method === 'GET' ? req.query._where : req.body._where;
    let payload = null;

    if (typeof where === 'undefined') {
        return true;
    } else if (req.method !== 'GET') {
        // for safety reason, only GET method allows '_where' param
        payload = new Res.BadReq({ details: 'HTTP method doesn\'t accept \'_where\' param.' });
    } else if (!model) {
        // for safety reason, restrain the endpoints that accept '_where' param
        payload = new Res.BadReq({ details: 'The endpoint you requested doesn\'t accept \'_where\' param.' });
    } else if (!(where && typeof where === 'object')) {
        // only object type (but cannot be null) is valid for '_where'
        payload = new Res.BadReq({ details: '\'_where\' param is wrongly constructed.' });
    } else {
        try {
            validateOneObj(where, model.includeOnRetrieve.concat( model.referenceFields, Object.keys(ALLOWED_OP_ALIASES) ));
        } catch (e) {
            if (e instanceof InkError) {
                // don't relay on the InkError middleware at the end
                payload = new Res.BadReq({ details: '\'_where\' param is wrongly constructed.' });
            } else {
                // programing error
                throw e;
            }
        }
    }

    if (payload) {
        res.status(payload.status).json(payload);
        return false;
    } else {
        return true;
    }
}
