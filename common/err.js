module.exports = function Err(status, message, details) {
    this.status = status;
    this.message = message;
    this.details = details;
}
