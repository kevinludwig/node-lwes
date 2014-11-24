/*======================================================================*
 * Copyright (c) 2014, Kevin Ludwig, All rights reserved.               *
 *                                                                      *
 * Licensed under the New BSD License (the "License"); you may not use  *
 * this file except in compliance with the License. Unless required     *
 * by applicable law or agreed to in writing, software distributed      *
 * under the License is distributed on an "AS IS" BASIS, WITHOUT        *
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.     *
 * See the License for the specific language governing permissions and  *
 * limitations under the License. See accompanying LICENSE file.        *
 * =====================================================================*/

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
        self.socket.on('message', function(msg, rinfo) {
            var ev = new Event();
            ev.deserialize(msg);

            ev.set_int64(Event.RECEIPT_TIME, new Date().getTime());
            ev.set_ipaddr(Event.SENDER_IP, rinfo.address);
            ev.set_uint16(Event.SENDER_PORT, rinfo.port);

            callback(null,ev);
        });
        self.socket.on('error', callback);
    });
};
Listener.prototype.destroy = function() {
    var self = this;
    if (self.socket) {
        self.socket.dropMembership(self.address);
        self.socket.close();
        self.socket = null;
    }
};
