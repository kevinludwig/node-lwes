var ip = require('ip'),
    types = require('./types');

var serializeDouble = exports.serializeDouble = function(value, buffer, offset) {
    buffer.writeDoubleLE(value, offset);
    return 8;
};

var serializeFloat = exports.serializeFloat = function(value, buffer, offset) {
    buffer.writeFloatLE(value, offset);
    return 4;
};

var serializeByte = exports.serializeByte = function(value, buffer, offset) {
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
};

var serializeUInt16 = exports.serializeUInt16 = function(value, buffer, offset) {
    buffer.writeUInt16LE(value >>> 0, offset);
    return 2;
};

var serializeInt16 = exports.serializeInt16 = function(value, buffer, offset) {
    buffer.writeInt16LE(value, offset);
    return 2;
};

var serializeUInt32 = exports.serializeUInt32 = function(value, buffer, offset) {
    buffer.writeUInt32LE(value >>> 0, offset);
    return 4;
};

var serializeInt32 = exports.serializeInt32 = function(value, buffer, offset) {
    buffer.writeInt32LE(value, offset);
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

var serializeUInt64Array = exports.serializeInt64Array = function(value, buffer, offset) {
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
var serializeEventWord = exports.serializeEventWord = function(value, buffer, offset, encoding) {
    var len = value.length;
    if (len <= 0 || len > 255) return 0;
    else return serializeString(value, buffer, offset, encoding);
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
        default:
            throw new Error("Unknown type argument:"+type);
    };
};
