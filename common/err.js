function Err(status, message, details) {
    this.status = status;
    this.message = message;
    this.details = details;
}

Err.NotFound = new Err(404, 'Resources are not found.');


module.exports = Err;
