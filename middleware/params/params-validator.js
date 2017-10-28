/**
 * Register your params validators here.
 * Order matters here.
 * They all MUST be non-blocking.
 * 
 * In each validator, you could:
 *      - alter attributes of req
 *      - send error response
 */
const REGISTERED = [

];


module.exports = function(req, res, next) {
    REGISTERED.forEach((validator) => {
        validator(req, res);
    });
    // everything is okay
    next();
}
