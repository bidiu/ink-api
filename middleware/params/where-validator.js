const ALLOWED_OP_ALIASES = require('../../db/aliases');
const InkError = require('../../common/models/ink-errors');
const modelMap = require('../../models/models');

const KEY_NAME = '_where';
const MODEL_NAME_REGEX = /[a-zA-Z]+(?!.+[a-zA-Z]+)/gi
// IMPORTANT
const RESTRICTED_KEYS = [ 'private', 'sharing' ];

/**
 * Map requested API endpoint to corresponding requested model, if any.
 * 
 * @return
 *      mapped model class, or null if endpoint doesn't map to any model
 */
function getModel(path) {
    let matched = MODEL_NAME_REGEX.exec(path);
    let modelName = matched ? matched[0] : '';
    MODEL_NAME_REGEX.lastIndex = 0;
    return modelMap.get(modelName) || null;
}

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
function validate(req, model) {
    let where = req.method === 'GET' ? req.query._where : req.body._where;

    if (typeof where === 'undefined') {
        return true;
    } else if (req.method !== 'GET') {
        // for safety reason, only GET method allows '_where' param
        throw new InkError.BadReq({ details: 'HTTP method doesn\'t accept \'_where\' param.' });
    } else if (!model) {
        // for safety reason, restrain the endpoints that accept '_where' param
        throw new InkError.BadReq({ details: 'The endpoint you requested doesn\'t accept \'_where\' param.' });
    } else if (!(where && typeof where === 'object')) {
        // only object type (but cannot be null) is valid for '_where'
        throw new InkError.BadReq({ details: '\'_where\' param is wrongly constructed.' });
    } else {
        try {
            let allowedKeys = model.includeOnRetrieve
                    .concat( Object.keys(ALLOWED_OP_ALIASES) )
                    .filter((k) => {
                        return !RESTRICTED_KEYS.includes(k) && !( model.sharingFields && model.sharingFields.includes(k) );
                    });

            validateOneObj(where, allowedKeys);
        } catch (e) {
            if (e instanceof InkError) {
                // don't relay on the InkError middleware at the end
                throw new InkError.BadReq({ details: '\'_where\' param is wrongly constructed.' });
            } else {
                // programing error
                throw e;
            }
        }
    }
}

/**
 * a validator designated for `_where` parameter
 * 
 * @param {*} name 
 * @param {*} val 
 * @param {*} req 
 */
module.exports = function(name, val, req) {
    validate(req, getModel(req.path));
}
