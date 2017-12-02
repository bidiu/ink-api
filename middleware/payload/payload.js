/**
 * Register your post payload process functions here.
 * Order matters here.
 * They all MUST be non-blocking.
 */
const REGISTERED = [
    require('./plain'),
    require('./endpoints'),
    // require('./foreign-keys')
];


function processPayload(payload, req) {
    for (let proc of REGISTERED) {
        payload = proc(payload, req);
    }
    return payload;
}


module.exports = processPayload;
