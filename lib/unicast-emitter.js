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

var util = require('util'),
    BaseEmitter = require('./base-emitter');

var Emitter = module.exports = function(address, port) {
    var self = this;

    BaseEmitter.call(self, address,port);

    self.startup();
};
util.inherits(Emitter, BaseEmitter);

Emitter.prototype.emit = function(ev) {
    var self = this;
    BaseEmitter.prototype.emit.call(self, ev);
    self.collectStatistics();
};

Emitter.prototype.destroy = function() {
    var self = this;
    if (self.socket) {
        self.shutdown();
        BaseEmitter.prototype.destroy.call(self);
    }
};
