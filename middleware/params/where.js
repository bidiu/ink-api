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

module.exports = function(req, res, model) {
    let where = req.method === 'GET' ? req.query._where : req.body._where;
    let payload = null;

    if (!where) { return true; }
    else if (!model) {
        // for safety reasson, restrain the endpoints that accept '_where' param
        payload = new Res.BadReq({ details: 'The endpoint you requested doesn\'t accept \'_where\' param.' });
    } else {
        try {
            validateOneObj(where, model.includeOnRetrieve.concat( Object.keys(ALLOWED_OP_ALIASES) ));
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
