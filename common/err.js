module.exports = function Err(status, message, stack) {
    this.status = status;
    this.message = message;
    this.stack = stack;
}
