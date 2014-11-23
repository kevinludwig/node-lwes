var dgram = require('dgram');

var Emitter = module.exports = function(address, port) {
    var self = this;
    self.socket = dgram.createSocket('udp4');
    self.address = address;
    self.port = port;
};
Emitter.prototype.emit = function(ev) {
    var self = this;
    var buffer = new Buffer(ev.byteSize());
    ev.serialize(buffer);
    self.socket.send(buffer, 0, buffer.length, self.port, self.address);
};
Emitter.prototype.close = function() {
    var self = this;
    if (self.socket) {
        self.socket.close();
        self.socket = null;
    }
};
