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

var ip = require('ip'),
    bignum = require('bignum'),
    types = require('./types');

var deserializeDouble = exports.deserializeDouble = function(buffer, state) {
    var data = buffer.readDoubleBE(state.offset());
    state.incr(8);
    return data;
};

var deserializeFloat = exports.deserializeFloat = function(buffer, state) {
    var data = buffer.readFloatBE(state.offset());
    state.incr(4);
    return data;
};

var deserializeByte = exports.deserializeByte = function(buffer, state) {
    var data = buffer.readUInt8(state.offset());
    state.incr(1);
    return data;
};

var deserializeBoolean = exports.deserializeBoolean = function(buffer,state) {
    var data = buffer.readUInt8(state.offset()) === 1 ? true : false;
    state.incr(1);
    return data;
};

var deserializeIpAddr = exports.deserializeIpAddr = function(buffer, state) {
    var data = ip.toString(buffer.slice(state.offset(), state.offset()+4));
    state.incr(4);
    return data;
};

var deserializeUInt16 = exports.deserializeUInt16 = function(buffer, state) {
    var data = buffer.readUInt16BE(state.offset());
    state.incr(2);
    return data;
};

var deserializeInt16 = exports.deserializeInt16 = function(buffer, state) {
    var data = buffer.readInt16BE(state.offset());
    state.incr(2);
    return data;
};

var deserializeUInt32 = exports.deserializeUInt32 = function(buffer, state) {
    var data = buffer.readUInt32BE(state.offset());
    state.incr(4);
    return data;
};

var deserializeInt32 = exports.deserializeInt32 = function(buffer, state) {
    var data = buffer.readInt32BE(state.offset());
    state.incr(4);
    return data;
};

var deserializeUInt64 = exports.deserializeUInt64 = function(buffer, state) {
    var data = bignum.fromBuffer(buffer, state.offset());
    state.incr(8);
    return data;
};

var deserializeInt64 = exports.deserializeInt64 = function(buffer, state) {
    var data = bignum.fromBuffer(buffer, state.offset());
    state.incr(8);
    return data;
};

var deserializeString = exports.deserializeString = function(buffer, state, encoding) {
    var len = deserializeUInt16(buffer,state);
    var data = buffer.toString(encoding, state.offset(), state.offset() + len);
    state.incr(len);
    return data;
};

var deserializeStringArray = exports.deserializeStringArray = function(buffer, state, encoding) {
    var len = deserializeUInt16(buffer, state);
    var data = [];
    for (var i = 0; i < len; i++) {
        data.push(deserializeString(buffer, state, encoding));
    }
    return data;
};

function deserializeArray(buffer, state, fn) {
    var len = deserializeUInt16(buffer, state);

    var data = [];
    for (var i = 0; i < len; i++) {
        data.push(fn(buffer, state));
    }
    return data;
}

var deserializeInt16Array = exports.deserializeInt16Array = function(buffer, state) {
    return deserializeArray(buffer, state, deserializeInt16);
};

var deserializeUInt16Array = exports.deserializeUInt16Array = function(buffer, state) {
    return deserializeArray(buffer, state, deserializeUInt16);
};

var deserializeInt32Array = exports.deserializeInt32Array = function(buffer, state) {
    return deserializeArray(buffer, state, deserializeInt32);
};

var deserializeUInt32Array = exports.deserializeUInt32Array = function(buffer, state) {
    return deserializeArray(buffer, state, deserializeUInt32);
};

var deserializeInt64Array = exports.deserializeInt64Array = function(buffer, state) {
    return deserializeArray(buffer, state, deserializeInt64);
};

var deserializeUInt64Array = exports.deserializeUInt64Array = function(buffer, state) {
    return deserializeArray(buffer, state, deserializeUInt64);
};

var deserializeBooleanArray = exports.deserializeBooleanArray = function(buffer, state) {
    return deserializeArray(buffer, state, deserializeBoolean);
};

var deserializeByteArray = exports.deserializeByteArray = function(buffer, state) {
    return deserializeArray(buffer, state, deserializeByte);
};

var deserializeDoubleArray = exports.deserializeDoubleArray = function(buffer, state) {
    return deserializeArray(buffer, state, deserializeDouble);
};

var deserializeFloatArray = exports.deserializeFloatArray = function(buffer, state) {
    return deserializeArray(buffer, state, deserializeFloat);
};

var deserializeIpAddrArray = exports.deserializeIpAddrArray = function(buffer,state) {
    return deserializeArray(buffer, state, deserializeIpAddr);
};
var deserializeEventWord = exports.deserializeEventWord = function(buffer, state, encoding) {
    return deserializeString(buffer, state, encoding);
};

exports.deserializeAttributeWord = function(buffer, state, encoding) {
    return deserializeEventWord(buffer, state, encoding);
};

exports.deserializeValue = function(buffer, state, type, encoding) {
    switch(type) {
        case types.BYTE:
            return deserializeByte(buffer, state);
        case types.BOOLEAN:
            return deserializeBoolean(buffer, state);
        case types.UINT16:
            return deserializeUInt16(buffer, state);
        case types.INT16:
            return deserializeInt16(buffer, state);
        case types.UINT32:
            return deserializeUInt32(buffer, state);
        case types.INT32:
            return deserializeInt32(buffer, state);
        case types.UINT64:
            return deserializeUInt64(buffer, state);
        case types.INT64:
            return deserializeInt64(buffer, state);
        case types.STRING:
            return deserializeString(buffer, state, encoding);
        case types.DOUBLE:
            return deserializeDouble(buffer, state);
        case types.FLOAT:
            return deserializeFloat(buffer, state);
        case types.IPADDR:
            return deserializeIpAddr(buffer, state);
        case types.STRING_ARRAY:
            return deserializeStringArray(buffer, state);
        case types.BYTE_ARRAY:
            return deserializeByteArray(buffer, state);
        case types.UINT16_ARRAY:
            return deserializeUInt16Array(buffer, state);
        case types.INT16_ARRAY:
            return deserializeInt16Array(buffer, state);
        case types.UINT32_ARRAY:
            return deserializeUInt32Array(buffer, state);
        case types.INT32_ARRAY:
            return deserializeInt32Array(buffer, state);
        case types.UINT64_ARRAY:
            return deserializeUInt64Array(buffer, state);
        case types.INT64_ARRAY:
            return deserializeInt64Array(buffer, state);
        case types.BOOLEAN_ARRAY:
            return deserializeBooleanArray(buffer, state);
        case types.DOUBLE_ARRAY:
            return deserializeDoubleArray(buffer, state);
        case types.FLOAT_ARRAY:
            return deserializeFloatArray(buffer, state);
        case types.IPADDR_ARRAY:
            return deserializeIpAddrArray(buffer, state);
        default:
            throw new Error("Unknown type argument:"+type);
    }
};
