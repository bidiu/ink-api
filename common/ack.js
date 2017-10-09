module.exports = function Ack(message, data) {
    this.status = 200;
    this.message = message;
    this.data = data;
}
