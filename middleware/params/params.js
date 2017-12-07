/**
 * Register your param validators down below.
 * 
 * Validator is for validating the user-given parameters, you'd better NOT to
 * change them, instead throwing errors when running into invalid parameters.
 */
const VALIDATOR_MAP = new Map([
    ['type', require('./type-validator')]
]);

/**
 * No need to take care of `undefined` - JSON doesn't have `undefined`, and
 * a middleware taking care of `undefeined` will be added in front of this.
 * Well, optional param still COULD be `undefined` (`null` is a valid required
 * value).
 */
module.exports = function(ruleSet) {
    // generate the middleware to return
    return function(req, res, next) {
        let params = req.method === 'GET' ? req.query : req.body;

        try {
            Object.entries(ruleSet).forEach(([name, rules]) => {
                
                rules.forEach((rule) => {
                    VALIDATOR_MAP.get(rule.validator)(name, params[name], rule);
                });
            });

            // everthing is okay
            next();
        } catch(err) {
            // let error middleware to handle
            next(err);
        }
    }
}
