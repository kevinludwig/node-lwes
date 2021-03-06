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
    types = require('./types');

var serializeDouble = exports.serializeDouble = function(value, buffer, offset) {
    buffer.writeDoubleBE(value, offset);
    return 8;
};

var serializeFloat = exports.serializeFloat = function(value, buffer, offset) {
    buffer.writeFloatBE(value, offset);
    return 4;
};

var serializeByte = exports.serializeByte = function(value, buffer, offset) {
    buffer.writeUInt8(value >>> 0, offset);
    return 1;
};

var serializeUByte = exports.serializeUByte = function(value, buffer, offset) {
    buffer.writeUInt8(value >>> 0, offset);
    return 1;
};


var serializeBoolean = exports.serializeBoolean = function(value, buffer, offset) {
    var b = value ? 1 : 0;
    buffer.writeUInt8(b >>> 0, offset);
    return 1;
};

var serializeIpAddr = exports.serializeIpAddr = function(value, buffer, offset) {
    ip.toBuffer(value,buffer,offset);
    return 4;
};

var serializeUInt16 = exports.serializeUInt16 = function(value, buffer, offset) {
    buffer.writeUInt16BE(value >>> 0, offset);
    return 2;
};

var serializeInt16 = exports.serializeInt16 = function(value, buffer, offset) {
    buffer.writeInt16BE(value, offset);
    return 2;
};

var serializeUInt32 = exports.serializeUInt32 = function(value, buffer, offset) {
    buffer.writeUInt32BE(value >>> 0, offset);
    return 4;
};

var serializeInt32 = exports.serializeInt32 = function(value, buffer, offset) {
    buffer.writeInt32BE(value, offset);
    return 4;
};

var serializeUInt64 = exports.serializeUInt64 = function(value, buffer, offset) {
    // typeof value === bignum
    if (value.toBuffer === undefined) throw new Error("Invalid Argument: must be bignum");
    value.toBuffer().copy(buffer, offset);
    return 8;
};

var serializeInt64 = exports.serializeInt64 = function(value, buffer, offset) {
    // typeof value === bignum
    if (value.toBuffer === undefined) throw new Error("Invalid Argument: must be bignum");
    value.toBuffer().copy(buffer, offset);
    return 8;
};

var serializeString = exports.serializeString = function(value, buffer, offset, encoding) {
    var prefix = serializeUInt16(value.length, buffer, offset);
    offset += prefix;

    buffer.write(value, offset, offset + value.length, encoding);
    return prefix + value.length;
};

var serializeStringArray = exports.serializeStringArray = function(value, buffer, offset, encoding) {
    var initial = offset;

    offset += serializeUInt16(value.length, buffer, offset);

    value.forEach(function(val) {
        offset += serializeString(val, buffer, offset, encoding);
    });
    return offset - initial;
};

function serializeArray(value, buffer, offset, fn) {
    var initial = offset;

    offset += serializeUInt16(value.length, buffer, offset);

    value.forEach(function(val) {
        offset +=  fn(val, buffer, offset);
    });
    return offset - initial;
}

var serializeInt16Array = exports.serializeInt16Array = function(value, buffer, offset) {
    return serializeArray(value, buffer, offset, serializeInt16);
};

var serializeUInt16Array = exports.serializeUInt16Array = function(value, buffer, offset) {
    return serializeArray(value, buffer, offset, serializeUInt16);
};

var serializeInt32Array = exports.serializeInt32Array = function(value, buffer, offset) {
    return serializeArray(value, buffer, offset, serializeInt32);
};

var serializeUInt32Array = exports.serializeUInt32Array = function(value, buffer, offset) {
    return serializeArray(value, buffer, offset, serializeUInt32);
};

var serializeInt64Array = exports.serializeInt64Array = function(value, buffer, offset) {
    return serializeArray(value, buffer, offset, serializeInt64);
};

var serializeUInt64Array = exports.serializeUInt64Array = function(value, buffer, offset) {
    return serializeArray(value, buffer, offset, serializeUInt64);
};

var serializeBooleanArray = exports.serializeBooleanArray = function(value, buffer, offset) {
    return serializeArray(value, buffer, offset, serializeBoolean);
};

var serializeByteArray = exports.serializeByteArray = function(value, buffer, offset) {
    return serializeArray(value, buffer, offset, serializeByte);
};

var serializeDoubleArray = exports.serializeDoubleArray = function(value, buffer, offset) {
    return serializeArray(value, buffer, offset, serializeDouble);
};

var serializeFloatArray = exports.serializeFloatArray = function(value, buffer, offset) {
    return serializeArray(value, buffer, offset, serializeFloat);
};

var serializeIpAddrArray = exports.serializeIpAddrArray = function(value,buffer,offset) {
    return serializeArray(value,buffer,offset,serializeIpAddr);
};

function serializeBitset(bitset, len, buffer, offset) {
    var initial = offset;
    offset += serializeUInt16(len, buffer, offset);

    var paddedLength = 8 * Math.ceil(len/8.0);
    for (var i = 0; i < paddedLength; i++) {
        var index = i >>> 3; // Math.floor(i / 8.0)
        var c = i % 8;
        var byte = buffer.readUInt8(offset+index);

        if (bitset.get(i)) byte |= (1 << c);
        else byte &= ~(1 << c);
        
        buffer.writeUInt8(byte, offset+index);
    }
    offset += Math.ceil(len/8.0);
    return offset - initial;
}

function serializeNArray(values, buffer, offset, fn) {
    var initial = offset;

    offset += serializeUInt16(values.length, buffer, offset);

    var bitset = new Bitset(values.length);
    values.forEach(function(v, index) {
        if (v !== null) bitset.set(index);
    });

    offset += serializeBitset(bitset, values.length, buffer, offset);

    values.forEach(function(v) {
        if (v !== null) offset += fn(v, buffer, offset);
    });

    return offset - initial;
}

function serializeNStringArray(values, buffer, offset, encoding) {
    var initial = offset;

    offset += serializeUInt16(values.length, buffer, offset);

    var bitset = new Bitset(values.length);
    values.forEach(function(v, index) {
        if (v !== null) bitset.set(index);
    });

    offset += serializeBitset(bitset, values.length, buffer, offset);

    values.forEach(function(v) {
        if (v !== null) offset += serializeString(v, buffer, offset, encoding);
    });

    return offset - initial;
}

var serializeNInt16Array = exports.serializeNInt16Array = function(value, buffer, offset) {
    return serializeNArray(value, buffer, offset, serializeInt16);
};

var serializeNUInt16Array = exports.serializeNUInt16Array = function(value, buffer, offset) {
    return serializeNArray(value, buffer, offset, serializeUInt16);
};

var serializeNInt32Array = exports.serializeNInt32Array = function(value, buffer, offset) {
    return serializeNArray(value, buffer, offset, serializeInt32);
};

var serializeNUInt32Array = exports.serializeNUInt32Array = function(value, buffer, offset) {
    return serializeNArray(value, buffer, offset, serializeUInt32);
};

var serializeNInt64Array = exports.serializeNInt64Array = function(value, buffer, offset) {
    return serializeNArray(value, buffer, offset, serializeInt64);
};

var serializeNUInt64Array = exports.serializeNUInt64Array = function(value, buffer, offset) {
    return serializeNArray(value, buffer, offset, serializeUInt64);
};

var serializeNBooleanArray = exports.serializeNBooleanArray = function(value, buffer, offset) {
    return serializeNArray(value, buffer, offset, serializeBoolean);
};

var serializeNByteArray = exports.serializeNByteArray = function(value, buffer, offset) {
    return serializeNArray(value, buffer, offset, serializeByte);
};

var serializeNDoubleArray = exports.serializeNDoubleArray = function(value, buffer, offset) {
    return serializeNArray(value, buffer, offset, serializeDouble);
};

var serializeNFloatArray = exports.serializeNFloatArray = function(value, buffer, offset) {
    return serializeNArray(value, buffer, offset, serializeFloat);
};

var serializeNIpAddrArray = exports.serializeNIpAddrArray = function(value,buffer,offset) {
    return serializeNArray(value,buffer,offset,serializeIpAddr);
};

var serializeEventWord = exports.serializeEventWord = function(value, buffer, offset, encoding) {
    var prefix = serializeUByte(value.length, buffer, offset);
    offset += prefix;

    buffer.write(value, offset, offset + value.length, encoding);
    return prefix + value.length;
};

exports.serializeAttributeWord = function(value, buffer, offset, encoding) {
    return serializeEventWord(value, buffer, offset, encoding);
};

exports.serializeValue = function(type, data, encoding, buffer, offset) {
    switch(type) {
        case types.BYTE:
            return serializeByte(data, buffer, offset);
        case types.BOOLEAN:
            return serializeBoolean(data, buffer, offset);
        case types.UINT16:
            return serializeUInt16(data, buffer, offset);
        case types.INT16:
            return serializeInt16(data, buffer, offset);
        case types.UINT32:
            return serializeUInt32(data, buffer, offset);
        case types.INT32:
            return serializeInt32(data, buffer, offset);
        case types.UINT64:
            return serializeUInt64(data, buffer, offset);
        case types.INT64:
            return serializeInt64(data, buffer, offset);
        case types.STRING:
            return serializeString(data, buffer, offset, encoding);
        case types.DOUBLE:
            return serializeDouble(data, buffer, offset);
        case types.FLOAT:
            return serializeFloat(data, buffer,offset);
        case types.IPADDR:
            return serializeIpAddr(data, buffer, offset);
        case types.STRING_ARRAY:
            return serializeStringArray(data,buffer,offset);
        case types.BYTE_ARRAY:
            return serializeByteArray(data, buffer, offset);
        case types.UINT16_ARRAY:
            return serializeUInt16Array(data,buffer,offset);
        case types.INT16_ARRAY:
            return serializeInt16Array(data,buffer,offset);
        case types.UINT32_ARRAY:
            return serializeUInt32Array(data,buffer,offset);
        case types.INT32_ARRAY:
            return serializeInt32Array(data,buffer,offset);
        case types.UINT64_ARRAY:
            return serializeUInt64Array(data,buffer,offset);
        case types.INT64_ARRAY:
            return serializeInt64Array(data,buffer,offset);
        case types.BOOLEAN_ARRAY:
            return serializeBooleanArray(data,buffer,offset);
        case types.DOUBLE_ARRAY:
            return serializeDoubleArray(data,buffer,offset);
        case types.FLOAT_ARRAY:
            return serializeFloatArray(data,buffer,offset);
        case types.IPADDR_ARRAY:
            return serializeIpAddrArray(data, buffer, offset);
        case types.NSTRING_ARRAY:
            return serializeNStringArray(data,buffer,offset);
        case types.NBYTE_ARRAY:
            return serializeNByteArray(data, buffer, offset);
        case types.NUINT16_ARRAY:
            return serializeNUInt16Array(data,buffer,offset);
        case types.NINT16_ARRAY:
            return serializeNInt16Array(data,buffer,offset);
        case types.NUINT32_ARRAY:
            return serializeNUInt32Array(data,buffer,offset);
        case types.NINT32_ARRAY:
            return serializeNInt32Array(data,buffer,offset);
        case types.NUINT64_ARRAY:
            return serializeNUInt64Array(data,buffer,offset);
        case types.NINT64_ARRAY:
            return serializeNInt64Array(data,buffer,offset);
        case types.NBOOLEAN_ARRAY:
            return serializeNBooleanArray(data,buffer,offset);
        case types.NDOUBLE_ARRAY:
            return serializeNDoubleArray(data,buffer,offset);
        case types.NFLOAT_ARRAY:
            return serializeNFloatArray(data,buffer,offset);
        case types.NIPADDR_ARRAY:
            return serializeNIpAddrArray(data, buffer, offset);
        default:
            throw new Error("Unknown type argument:"+type);
    }
};
