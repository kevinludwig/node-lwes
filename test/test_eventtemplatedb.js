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

var should = require('should'),
    path = require('path'),
    Event = require('../lib/event'),
    EventTemplateDB = require('../lib/eventtemplatedb');

describe("EventTemplateDB", function() {
    var file = path.join(__dirname, "file.esf");
    it("should return true for valid event", function(done) {
        var db = new EventTemplateDB(file);
        db.initialize(function(err) {
            should.not.exist(err);
            
            var ev = new Event("TestEvent");
            ev.set_string("k","test");
            ev.set_int32("intkey", 123);
            ev.set_int16("int16key", 1);
            ev.set_uint32_array("ik", [1,2,3,4]);
            db.validate(ev).should.be.eql(true);
            done();
        });
    });
});
