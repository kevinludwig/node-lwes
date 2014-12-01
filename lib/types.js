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

exports.UINT16 = 0x1;
exports.INT16 = 0x2;
exports.UINT32 = 0x3;
exports.INT32 = 0x4;
exports.STRING = 0x5;
exports.IPADDR = 0x6;
exports.INT64 = 0x7;
exports.UINT64 = 0x8;
exports.BOOLEAN = 0x9;
exports.BYTE = 0xA;
exports.FLOAT = 0xB;
exports.DOUBLE = 0xC;

exports.UINT16_ARRAY = 0x81;
exports.INT16_ARRAY = 0x82;
exports.UINT32_ARRAY = 0x83;
exports.INT32_ARRAY = 0x84;
exports.STRING_ARRAY = 0x85;
exports.IPADDR_ARRAY = 0x86;
exports.INT64_ARRAY = 0x87;
exports.UINT64_ARRAY = 0x88;
exports.BOOLEAN_ARRAY = 0x89;
exports.BYTE_ARRAY = 0x8A;
exports.FLOAT_ARRAY = 0x8B;
exports.DOUBLE_ARRAY = 0x8C;

exports.NUINT16_ARRAY = 0x8D;
exports.NINT16_ARRAY = 0x8E;
exports.NUINT32_ARRAY = 0x8F;
exports.NINT32_ARRAY = 0x90;
exports.NSTRING_ARRAY = 0x91;
exports.NIPADDR_ARRAY = 0x92;
exports.NINT64_ARRAY = 0x93;
exports.NUINT64_ARRAY = 0x94;
exports.NBOOLEAN_ARRAY = 0x95;
exports.NBYTE_ARRAY = 0x96;
exports.NFLOAT_ARRAY = 0x97;
exports.NDOUBLE_ARRAY = 0x98;

var typeMap = {
    uint16: exports.UINT16,
    int16: exports.INT16,
    uint32: exports.UINT32,
    int32: exports.INT32,
    uint64: exports.UINT32,
    int64: exports.INT64,
    string: exports.STRING,
    ip_addr: exports.IPADDR,
    boolean: exports.BOOLEAN,
    float: exports.FLOAT,
    double: exports.DOUBLE,
    byte: exports.BYTE
};

exports.nameToId = function(typename, isarray, nullable) {
    var val = typeMap[typename];
    var offset = nullable ? 12 : 0;
    return isarray ? (val | 0x80) + offset : val;
};

function bitsetByteCount(len) {
    return 2 + Math.ceil(len / 8.0);
}
function narraySize(values) {
    var count = 0;
    for (var i = 0; i < values.length; i++) if (values[i] !== null) count++;
    return count;
}

exports.sizeof = function(type, value) {
    var size,len,i;
    switch (type) {
        case exports.BYTE:
        case exports.BOOLEAN:
            return 1;
        case exports.UINT16:
        case exports.INT16:
            return 2;
        case exports.UINT32:
        case exports.INT32:
        case exports.FLOAT:
        case exports.IPADDR:
            return 4;
        case exports.UINT64:
        case exports.INT64:
        case exports.DOUBLE:
            return 8;
        case exports.STRING:
        case exports.BYTE_ARRAY:
        case exports.BOOLEAN_ARRAY:
            return 2 + value.length;
        case exports.UINT16_ARRAY:
        case exports.INT16_ARRAY:
            return 2 + (2 * value.length);
        case exports.UINT32_ARRAY:
        case exports.INT32_ARRAY:
        case exports.FLOAT_ARRAY:
        case exports.IPADDR_ARRAY:
            return 2 + (4 * value.length);
        case exports.UINT64_ARRAY:
        case exports.INT64_ARRAY:
        case exports.DOUBLE_ARRAY:
            return 2 + (8 * value.length);
        case exports.STRING_ARRAY:
            size = 2;
            len = value.length;
            
            for (i = 0; i < len; i++) size += (value[i].length + 2);
            return size;
        case exports.NBYTE_ARRAY:
        case exports.NBOOLEAN_ARRAY:
            return 2 + narraySize(value) + bitsetByteCount(value.length);
        case exports.NUINT16_ARRAY:
        case exports.NINT16_ARRAY:
            return 2 + (2 * narraySize(value)) + bitsetByteCount(value.length);
        case exports.NUINT32_ARRAY:
        case exports.NINT32_ARRAY:
        case exports.NFLOAT_ARRAY:
        case exports.NIPADDR_ARRAY:
            return 2 + (4 * narraySize(value)) + bitsetByteCount(value.length);
        case exports.NUINT64_ARRAY:
        case exports.NINT64_ARRAY:
        case exports.NDOUBLE_ARRAY:
            return 2 + (8 * narraySize(value)) + bitsetByteCount(value.length);
        case exports.NSTRING_ARRAY:
            size = 2;
            len = value.length;

            for (i = 0; i < len; i++) 
                if (value[i] !== null) 
                    size += (value[i].length + 2);
            size += bitsetByteCount(value.length);
            return size;

        default:
            throw new Error("Unknown type:"+type);
    }
};
