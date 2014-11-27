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
    _ = require('underscore'),
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

function notNull(k) {
    return k !== null;
}
function checkRequired(template, ev) {
    return Object.keys(template).map(function(key) {
        var attrib = ev.attributes[key];
        var val = template[key];
        
        if (val.required && !attrib) return "required field missing "+key;
        else return null;
    }).filter(notNull);


}
function checkFields(template, ev) {
    return Object.keys(ev.attributes).map(function(key) {
        //validate, return true for validation failure.
        var attrib = ev.attributes[key];
        var val = template[key];

        if (!val) return "attribute not found in event template "+key;
        if (!val.nullable && !attrib.value) return "attribute value null for "+key;

        var isarray = val.arraySize !== null;
        if (types.nameToId(val.typeName, isarray) !== attrib.type) return "type mismatch for "+key;
        
        if (isarray && attrib.value.length > val.arraySize) return "array larger than limit for "+key;
        return null;
    }).filter(notNull);
}
EventTemplateDB.prototype.validate = function(ev) {
    var self = this;
    var eventName = ev.name;
    var metaEventInfo = self.db.MetaEventInfo || {};
    var template = self.db[eventName]; 

    if (!template) return ["no event definition for " + eventName];
    else template = _.extend(metaEventInfo,template);

    return checkRequired(template, ev).concat(checkFields(template,ev));
};
