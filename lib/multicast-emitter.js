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
