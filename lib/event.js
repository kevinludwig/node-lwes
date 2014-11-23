var types = require('./types'),
    encodings = require('./encodings'),
    serializer = require('./serializer'),
    deserializer = require('./deserializer');

function Event(name) {
    this.name = name;
    this.byteCount = 0;
    this.attributes = {};
    this.encoding = encodings.UTF_8;
    
    this.ENCODING = 'enc';
    this.RECEIPT_TIME = 'ReceiptTime';
    this.SENDER_IP = 'SenderIP';
    this.SENDER_PORT = 'SenderPort';
}

Event.prototype.reset = function() {
    this.attributes = {};
    this.byteCount = 0;
};

Event.prototype.setEventName = function(name) {
    if (this.byteCount) {
        this.byteCount += (name.length - this.name.length);
    }
    this.name = name;
};

Event.prototype.byteSize = function() {
    var self = this;

    if (!self.byteCount) {
        self.byteCount = 0;
        self.byteCount += self.name.length + 2;
        self.byteCount += 2; 
        Object.keys(self.attributes).forEach(function(key) {
            var data = self.attributes[key];
            self.byteCount += key.length + 2;
            self.byteCount += 1;
            self.byteCount += types.sizeof(data.type, data.value); 
        });
    }
    return self.byteCount;
};

Event.prototype.serialize = function(buffer) {
    var self = this;
    var encStr = encodings.ENCODING_STRINGS[self.encoding];

    var pos = 0;
    pos += serializer.serializeEventWord(self.name, buffer, pos, encStr);
    
    pos += serializer.serializeUInt16(Object.keys(self.attributes).length, buffer, pos);
    
    var encoding = self.attributes[self.ENCODING];
    if (encoding) {
        pos += serializer.serializeAttributeWord(self.ENCODING, buffer, pos, encStr);
        pos += serializer.serializeByte(encoding.type, buffer, pos);
        pos += serializer.serializeUInt16(encoding.value, buffer, pos);
    }
    Object.keys(self.attributes).forEach(function(key) {
        var data = self.attributes[key];
        if (key !== self.ENCODING) {
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
        if (i === 0 && key === self.ENCODING && type === types.UINT16) {
            self.encoding = deserializer.deserializeUInt16(buffer,state);
        }

        var encStr = encodings.ENCODING_STRINGS[self.encoding];
        self.set(key, type, deserializer.deserializeValue(buffer, state, type, encStr)); 
    }
};

Event.prototype.set = function(key, type, value) {
    var self = this;
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
    if (self.byteSize && data) {
        self.byteSize -= key.length;
        self.byteSize -= 1;
        self.byteSize -= types.sizeof(data.type, data.value); 
    }
    delete self.attributes[key];
};

Event.prototype.get = function(key) {
    return this.attributes[key] ? this.attributes[key].value : null;
};
module.exports = Event;
