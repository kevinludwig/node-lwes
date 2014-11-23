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

exports.sizeof = function(type, value) {
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
            var size = 2,
                len = value.length;
            for (var i = 0; i < len; i++) size += (value[i].length + 2);
            return size;
        default:
            throw new Error("Unknown type:"+type);
    }
};
