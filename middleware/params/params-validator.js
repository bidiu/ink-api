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
    // require('./where'),
    // require('./limit')
];

// only try to validate if requesting /api/v${version}
const API_BASE_REGEX = /^\/api\/v\d+\//gi;
const MODEL_NAME_REGEX = /[a-zA-Z]+(?!.+[a-zA-Z]+)/gi

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

module.exports = function(req, res, next) {
    if (API_BASE_REGEX.test(req.path)) {
        API_BASE_REGEX.lastIndex = 0;
        let model = getModel(req.path);
        
        for (let validate of REGISTERED) {
            if (!validate(req, res, model)) {
                // failed
                return;
            }
        }
    }
    API_BASE_REGEX.lastIndex = 0;
    // everything is okay
    next();
}
