const KEY_NAME = '_limit';
const DEFAULT_MAX_LIMIT = 999;

module.exports = function(req, res, model) {
    let params = req.method === 'GET' ? req.query : req.body;
    let limit = params._limit;

    if (typeof limit === 'undefined') {
        return true;
    } else if (typeof limit === 'number') {
        if (limit > DEFAULT_MAX_LIMIT) {
            params._limit = DEFAULT_MAX_LIMIT;
        } else if (limit <= 0) {
            delete params._limit;
        }
    } else if (limit === '*') {
        params._limit = DEFAULT_MAX_LIMIT;
    } else {
        delete params._limit;
    }

    return true;
}
