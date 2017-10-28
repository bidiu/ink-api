const modelMap = require('../../models/models');

/**
 * Register your params validators here.
 * Order matters here.
 * They all MUST be non-blocking.
 * 
 * In each validator, you could either:
 *      - alter attributes of req (MUST return true)
 *      - send error response (MUST return false)
 */
const REGISTERED = [
    require('./where')
];

const API_BASE_REGEX = /^\/api\/v\d+\//;

/**
 * Map requested API endpoint to corresponding requested model, if any.
 * 
 * @return
 *      mapped model class, or null if endpoint doesn't map to any model
 */
function getModel(path) {
    let modelName = path.replace(API_BASE_REGEX, '');
    let i = modelName.indexOf('/');
    if (i !== -1) {
        modelName = modelName.substring(0, i);
    }
    return modelMap.get(modelName) || null;
}

module.exports = function(req, res, next) {
    let model = getModel(req.path);

    for (let validate of REGISTERED) {
        if (!validate(req, res, model)) {
            // failed
            return;
        }
    }
    // everything is okay
    next();
}
