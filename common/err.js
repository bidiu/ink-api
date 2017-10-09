module.exports = function Err(status, details, stack) {
    this.status = status;
    this.details = details;
    this.stack = stack;
}
