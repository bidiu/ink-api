/**
 * Register your post payload process functions here.
 * 
 * **Notes**
 *  - Order matters here.
 *  - They all MUST be non-blocking.
 *  - You must return the processed payload, and you are allowed to change 
 *    the passed-in payload.
 */
const REGISTERED = [
    require('./plain'),
    require('./endpoints'),
    // require('./foreign-keys')
];


async function processPayload(payload, req) {
    for (let proc of REGISTERED) {
        payload = await proc(payload, req);
    }
    return payload;
}


module.exports = processPayload;
