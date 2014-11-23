var dgram = require('dgram'),
    Event = require('./event');

var Listener = module.exports = function(address, port) {
    var self = this;
    self.socket = dgram.createSocket('udp4');
    self.address = address;
    self.port = port;
};

Listener.prototype.listen = function(callback) {
    var self = this;
    self.socket.bind(self.port, function() {
        self.socket.addMembership(self.address);
        self.socket.on('message', function(msg) {
            var ev = new Event();
            ev.deserialize(msg);
            callback(null,ev);
        });
        self.socket.on('error', callback);
    });
};
Listener.prototype.close = function() {
    var self = this;
    if (self.socket) {
        self.socket.dropMembership(self.address);
        self.socket.close();
        self.socket = null;
    }
};
