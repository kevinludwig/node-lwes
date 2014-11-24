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
    bignum = require('bignum'),
    Event = require('./event');

var Emitter = module.exports = function(address, port) {
    var self = this;
    self.socket = dgram.createSocket('udp4');
    self.address = address;
    self.port = port;

    // statistics 
    self.emitHeartbeat = false;
    self.eventCount = bignum(0);
    self.totalEventCount = bignum(0);
    self.frequency = 60000;
    self.lastBeatTime = 0;
    self.sequence = bignum(0);
};

Emitter.prototype.startup = function() {
    var self = this;
    self.lastBeatTime = new Date().getTime();
    self.emit(self.createEvent("System::Startup"));
};

Emitter.prototype.shutdown = function() {
    var self = this;
    var ev = self.createEvent("System::Shutdown");
    var thisFrequency = new Date().getTime() - self.lastBeatTime;
    self.sendEventWithStatistics(ev, thisFrequency);
};

Emitter.prototype.collectStatistics = function() {
    var self = this;

    self.eventCount = self.eventCount.add(1);
    self.totalEventCount = self.totalEventCount.add(1);
    self.sequence = self.sequence.add(1);

    var time = new Date().getTime();
    var thisFrequency = time - self.lastBeatTime;
    if (self.emitHeartbeat && thisFrequency >= self.frequency) {
        var ev = self.createEvent("System::Heartbeat");
        self.sendEventWithStatistics(ev, thisFrequency);
        self.eventCount = bignum(0);
        self.lastBeatTime = time;
    }
};

Emitter.prototype.sendEventWithStatistics = function(ev,freq) {
    var self = this;
    ev.set_int64("freq", bignum(freq));
    ev.set_int64("seq", self.sequence);
    ev.set_int64("count", self.eventCount);
    ev.set_int64("total", self.totalEventCount);
    return Emitter.prototype.emit.call(self,ev);
};

Emitter.prototype.createEvent = function(name) {
    return new Event(name);
};

Emitter.prototype.emit = function(ev) {
    var self = this;
    var buffer = new Buffer(ev.byteSize());
    buffer.fill(0);
    ev.serialize(buffer);
    self.socket.send(buffer, 0, buffer.length, self.port, self.address);
};
Emitter.prototype.destroy = function() {
    var self = this;
    if (self.socket) {
        self.socket.close();
        self.socket = null;
    }
};
