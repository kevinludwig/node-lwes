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
    types = require('./types'),
    encodings = require('./encodings'),
    serializer = require('./serializer'),
    deserializer = require('./deserializer');

function Event(name) {
    this.byteCount = 0;
    this.attributes = {};
    this.encoding = encodings.UTF_8;
    if (name) this.setEventName(name);
}

Event.MAX_EVENT_NAME_SIZE = 127;
Event.MAX_FIELD_NAME_SIZE = 255;
Event.MAX_MESSAGE_SIZE = 65507;

Event.ENCODING = 'enc';
Event.RECEIPT_TIME = 'ReceiptTime';
Event.SENDER_IP = 'SenderIP';
Event.SENDER_PORT = 'SenderPort';

Event.prototype.reset = function() {
    this.attributes = {};
    this.byteCount = 0;
};

Event.prototype.checkLength = function(k,n) {
    var self = this;
    var len = new Buffer(k,encodings.ENCODING_STRINGS[self.encoding]).length;
    if (len > n) {
        throw new Error(util.format('String %s exceeded max length, serialized length %d > %d', k, len, n)); 
    } 
};

Event.prototype.setEventName = function(name) {
    var self = this;
    self.checkLength(name, Event.MAX_EVENT_NAME_SIZE);

    if (this.byteCount) {
        this.byteCount += (name.length - this.name.length);
    }
    this.name = name;
};

Event.prototype.byteSize = function() {
    var self = this;

    if (!self.byteCount) {
        self.byteCount = 0;
        self.byteCount += self.name.length;
        self.byteCount += 3; 
        Object.keys(self.attributes).forEach(function(key) {
            var data = self.attributes[key];
            self.byteCount += key.length;
            self.byteCount += 2;
            self.byteCount += types.sizeof(data.type, data.value); 
        });
    }
    if (self.byteCount > Event.MAX_MESSAGE_SIZE) {
        throw new Error(util.format("Payload for %s exceeded max message size (size=%d, max=%d)", 
            self.name, self.byteCount, Event.MAX_MESSAGE_SIZE));
    }
    return self.byteCount;
};

Event.prototype.serialize = function(buffer) {
    var self = this;
    var encStr = encodings.ENCODING_STRINGS[self.encoding];

    var pos = 0;
    pos += serializer.serializeEventWord(self.name, buffer, pos, encStr);
    
    pos += serializer.serializeUInt16(Object.keys(self.attributes).length, buffer, pos);
    
    var encoding = self.attributes[Event.ENCODING];
    if (encoding) {
        pos += serializer.serializeAttributeWord(Event.ENCODING, buffer, pos, encStr);
        pos += serializer.serializeByte(encoding.type, buffer, pos);
        pos += serializer.serializeUInt16(encoding.value, buffer, pos);
    }
    Object.keys(self.attributes).forEach(function(key) {
        var data = self.attributes[key];
        if (key !== Event.ENCODING) {
            pos += serializer.serializeAttributeWord(key,buffer,pos, encStr);
            pos += serializer.serializeByte(data.type, buffer, pos);
            pos += serializer.serializeValue(data.type, data.value, encStr, buffer, pos);
        }
    });
    return pos;
};

function DeserializeState () {
    var self = this;
    this.n = 0;
    this.offset = function() {return self.n;};
    this.incr = function(n) {self.n += n;};
}

Event.prototype.deserialize = function(buffer) {
    var self = this;

    var state = new DeserializeState();

    if (!buffer || buffer.length === 0) return;

    self.name = deserializer.deserializeEventWord(buffer,state);
  
    var num = deserializer.deserializeUInt16(buffer,state);

    self.reset();
    for (var i = 0; i < num; i++) {
        var key = deserializer.deserializeAttributeWord(buffer,state);
        var type = deserializer.deserializeByte(buffer,state);
        if (i === 0 && key === Event.ENCODING && type === types.UINT16) {
            self.encoding = deserializer.deserializeUInt16(buffer,state);
        }
        else {
            var encStr = encodings.ENCODING_STRINGS[self.encoding];
            self.set(key, type, deserializer.deserializeValue(buffer, state, type, encStr)); 
        }
    }
};

Event.prototype.set = function(key, type, value) {
    var self = this;
    self.checkLength(key,Event.MAX_FIELD_NAME_SIZE);
    self.attributes[key] = {type: type, value: value};
};

Event.prototype.set_int16_array = function(key,value) { this.set(key, types.INT16_ARRAY, value);};
Event.prototype.set_int32_array = function(key,value) { this.set(key, types.INT32_ARRAY, value);};
Event.prototype.set_int64_array = function(key,value) { this.set(key, types.INT64_ARRAY, value);};
Event.prototype.set_uint16_array = function(key,value) { this.set(key, types.UINT16_ARRAY, value);};
Event.prototype.set_uint32_array = function(key,value) { this.set(key, types.UINT32_ARRAY, value);};
Event.prototype.set_uint64_array = function(key, value) { this.set(key, types.UINT64_ARRAY, value);}; 
Event.prototype.set_string_array = function(key,value) { this.set(key, types.STRING_ARRAY, value);};
Event.prototype.set_ipaddr_array = function(key,value) { this.set(key, types.IPADDR_ARRAY, value);};
Event.prototype.set_byte_array = function(key,value) { this.set(key, types.BYTE_ARRAY, value);};
Event.prototype.set_double_array = function(key,value) { this.set(key, types.DOUBLE_ARRAY, value);};
Event.prototype.set_float_array = function(key,value) { this.set(key, types.FLOAT_ARRAY, value);};
Event.prototype.set_boolean_array = function(key,value) { this.set(key, types.BOOLEAN_ARRAY, value);};

Event.prototype.set_nint16_array = function(key,value) { this.set(key, types.NINT16_ARRAY, value);};
Event.prototype.set_nint32_array = function(key,value) { this.set(key, types.NINT32_ARRAY, value);};
Event.prototype.set_nint64_array = function(key,value) { this.set(key, types.NINT64_ARRAY, value);};
Event.prototype.set_nuint16_array = function(key,value) { this.set(key, types.NUINT16_ARRAY, value);};
Event.prototype.set_nuint32_array = function(key,value) { this.set(key, types.NUINT32_ARRAY, value);};
Event.prototype.set_nuint64_array = function(key, value) { this.set(key, types.NUINT64_ARRAY, value);}; 
Event.prototype.set_nstring_array = function(key,value) { this.set(key, types.NSTRING_ARRAY, value);};
Event.prototype.set_nipaddr_array = function(key,value) { this.set(key, types.NIPADDR_ARRAY, value);};
Event.prototype.set_nbyte_array = function(key,value) { this.set(key, types.NBYTE_ARRAY, value);};
Event.prototype.set_ndouble_array = function(key,value) { this.set(key, types.NDOUBLE_ARRAY, value);};
Event.prototype.set_nfloat_array = function(key,value) { this.set(key, types.NFLOAT_ARRAY, value);};
Event.prototype.set_nboolean_array = function(key,value) { this.set(key, types.NBOOLEAN_ARRAY, value);};

Event.prototype.set_double = function (key,value) { this.set(key, types.DOUBLE, value);};
Event.prototype.set_float = function (key,value) { this.set(key, types.FLOAT, value);};
Event.prototype.set_byte = function(key,value) { this.set(key, types.BYTE, value);};
Event.prototype.set_boolean = function(key,value) { this.set(key,types.BOOLEAN, value);};
Event.prototype.set_uint16 = function(key,value) { this.set(key, types.UINT16,value);};
Event.prototype.set_int16 = function(key,value) { this.set(key,types.INT16, value);};
Event.prototype.set_uint32 = function(key,value) { this.set(key, types.UINT32, value);};
Event.prototype.set_int32 = function(key,value) { this.set(key, types.INT32, value);};
Event.prototype.set_uint64 = function(key,value) { this.set(key, types.UINT64, value);}; 
Event.prototype.set_int64 = function(key,value) { this.set(key, types.INT64, value);};
Event.prototype.set_string = function(key,value) { this.set(key, types.STRING, value); }; 
Event.prototype.set_ipaddr =  function(key,value) { this.set(key, types.IPADDR, value); };

Event.prototype.clear = function(key) {
    var self = this;
    var data = self.attributes[key];
    if (self.byteCount && data) {
        self.byteCount -= key.length;
        self.byteCount -= 2;
        self.byteCount -= types.sizeof(data.type, data.value); 
    }
    delete self.attributes[key];
};

Event.prototype.get = function(key) {
    return this.attributes[key] ? this.attributes[key].value : null;
};
module.exports = Event;
