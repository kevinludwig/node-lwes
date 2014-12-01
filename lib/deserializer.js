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
    Bitset = require('bitset'),
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

var deserializeUByte = exports.deserializeUByte = function(buffer, state) {
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

function deserializeBitset(buffer, state) {
    var size = deserializeUInt16(buffer, state);
    var numBytes = Math.ceil(size/8.0);
    var bitset = new Bitset(size);
    for (var i = 0; i < numBytes; i++) {
        var val = buffer.readUInt8(state.offset()+i);
        for (var j = 0; j < 8; j++) {
            var index = (i * 8) + j;
            if (val &  (1 << j)) bitset.set(index++);
        }
    }
    state.incr(numBytes);
    return bitset;
}

var deserializeNStringArray = exports.deserializeNStringArray = function(buffer, state, encoding) {
    var len = deserializeUInt16(buffer, state);
    var bitset = deserializeBitset(buffer, state);
    var data = [];
    for (var i = 0; i < len; i++) {
        if (bitset.get(i)) data.push(deserializeString(buffer, state, encoding));
        else data.push(null);
    }
    return data;
};

function deserializeNArray(buffer, state, fn) {
    var len = deserializeUInt16(buffer, state);
    var bitset = deserializeBitset(buffer, state);
    var data = [];
    for (var i = 0; i < len; i++) {
        if (bitset.get(i)) data.push(fn(buffer, state));
        else data.push(null);
    }
    return data;
}

var deserializeNInt16Array = exports.deserializeNInt16Array = function(buffer, state) {
    return deserializeNArray(buffer, state, deserializeInt16);
};

var deserializeNUInt16Array = exports.deserializeNUInt16Array = function(buffer, state) {
    return deserializeNArray(buffer, state, deserializeUInt16);
};

var deserializeNInt32Array = exports.deserializeNInt32Array = function(buffer, state) {
    return deserializeNArray(buffer, state, deserializeInt32);
};

var deserializeNUInt32Array = exports.deserializeNUInt32Array = function(buffer, state) {
    return deserializeNArray(buffer, state, deserializeUInt32);
};

var deserializeNInt64Array = exports.deserializeNInt64Array = function(buffer, state) {
    return deserializeNArray(buffer, state, deserializeInt64);
};

var deserializeNUInt64Array = exports.deserializeNUInt64Array = function(buffer, state) {
    return deserializeNArray(buffer, state, deserializeUInt64);
};

var deserializeNBooleanArray = exports.deserializeNBooleanArray = function(buffer, state) {
    return deserializeNArray(buffer, state, deserializeBoolean);
};

var deserializeNByteArray = exports.deserializeNByteArray = function(buffer, state) {
    return deserializeNArray(buffer, state, deserializeByte);
};

var deserializeNDoubleArray = exports.deserializeNDoubleArray = function(buffer, state) {
    return deserializeNArray(buffer, state, deserializeDouble);
};

var deserializeNFloatArray = exports.deserializeNFloatArray = function(buffer, state) {
    return deserializeNArray(buffer, state, deserializeFloat);
};

var deserializeNIpAddrArray = exports.deserializeNIpAddrArray = function(buffer,state) {
    return deserializeNArray(buffer, state, deserializeIpAddr);
};

var deserializeEventWord = exports.deserializeEventWord = function(buffer, state, encoding) {
    var len = deserializeUByte(buffer, state);
    var data = buffer.toString(encoding, state.offset(), state.offset() + len);
    state.incr(len);
    return data;
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
        case types.NSTRING_ARRAY:
            return deserializeNStringArray(buffer, state);
        case types.NBYTE_ARRAY:
            return deserializeNByteArray(buffer, state);
        case types.NUINT16_ARRAY:
            return deserializeNUInt16Array(buffer, state);
        case types.NINT16_ARRAY:
            return deserializeNInt16Array(buffer, state);
        case types.NUINT32_ARRAY:
            return deserializeNUInt32Array(buffer, state);
        case types.NINT32_ARRAY:
            return deserializeNInt32Array(buffer, state);
        case types.NUINT64_ARRAY:
            return deserializeNUInt64Array(buffer, state);
        case types.NINT64_ARRAY:
            return deserializeNInt64Array(buffer, state);
        case types.NBOOLEAN_ARRAY:
            return deserializeNBooleanArray(buffer, state);
        case types.NDOUBLE_ARRAY:
            return deserializeNDoubleArray(buffer, state);
        case types.NFLOAT_ARRAY:
            return deserializeNFloatArray(buffer, state);
        case types.NIPADDR_ARRAY:
            return deserializeNIpAddrArray(buffer, state);
        default:
            throw new Error("Unknown type argument:"+type);
    }
};
