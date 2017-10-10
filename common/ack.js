const DEFAULT_MSG = 'Request is processed successfully.';

/**
 * When data is not string type, message is optional.
 */
function Ack(message, data) {
    if (arguments.length === 1 && typeof message !== 'string') {
        data = message;
        message = DEFAULT_MSG;
    }
    this.status = 200;
    this.message = message;
    this.data = data;
}

Ack.defaultMsg = DEFAULT_MSG;


module.exports = Ack;
