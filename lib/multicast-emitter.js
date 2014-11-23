var dgram = require('dgram');

var Emitter = module.exports = function(address, port, ttl) {
    var self = this;
    self.socket = dgram.createSocket('udp4');
    self.address = address;
    self.port = port;
    self.ttl = ttl;
    self.socket.addMembership(self.address);
    self.socket.setMulticastTTL(self.ttl);
    self.socket.setBroadcast(true);
};
Emitter.prototype.emit = function(event) {
    var self = this;
    var buffer = new Buffer(event.byteSize());
    event.serialize(buffer);
    self.socket.send(buffer, 0, buffer.length, self.port, self.address);
};
Emitter.prototype.close = function() {
    var self = this;
    if (self.socket) {
        self.socket.close(); 
        self.socket = null;
    } 
};
