/*======================================================================*
 *  Copyright (c) 2014, All rights reserved.                            *
 *                                                                      * 
 *  Licensed under the New BSD License (the "License"); you may not use *
 *  this file except in compliance with the License. Unless required    *
 *  by applicable law or agreed to in writing, software distributed     *
 *  under the License is distributed on an "AS IS" BASIS, WITHOUT       *
 *  WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.    *
 *  See the License for the specific language governing permissions and *
 *  limitations under the License. See accompanying LICENSE file.       *
 * =====================================================================*/

var esfparser = require('./esfparser'),
    types = require('./types');

var EventTemplateDB = module.exports = function(filename) {
    this.filename = filename;
    this.db = null;
};

EventTemplateDB.prototype.initialize = function(callback) {
    var self = this;
    esfparser(self.filename, function(err,db) {
        self.db = db;
        callback(err);
    });
};

EventTemplateDB.prototype.validate = function(ev) {
    var self = this;
    var eventName = ev.name;
    var metaEventInfo = self.db.MetaEventInfo || {};
    var template = self.db[eventName]; // TODO: extend in metaEventInfo

    var fail = Object.keys(template).some(function(key) {
        //validate, return true for validation failure.
        var attrib = ev.attributes[key];
        var val = template[key];

        // required and not there
        if (val.required && !attrib) return true;

        if (attrib) {
            // value is null and null not allowed
            if (!val.nullable && !attrib.value) return true;

            // type mismatch
            var isarray = val.arraySize !== null;
            if (types.nameToId(val.typeName, isarray) !== attrib.type) return true;
        }
        return false;
    });

    return !fail;
};


