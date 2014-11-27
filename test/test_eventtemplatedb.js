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
    EventTemplateDB = require('../lib/event-template-db');

describe("EventTemplateDB", function() {
    var file = path.join(__dirname, "file.esf");
    it("should return [] for valid event", function(done) {
        var db = new EventTemplateDB(file);
        db.initialize(function(err) {
            should.not.exist(err);
            
            var ev = new Event("TestEvent");
            ev.set_string("k","test");
            ev.set_int32("intkey", 123);
            ev.set_int16("int16key", 1);
            ev.set_uint32_array("ik", [1,2,3,4]);
            ev.set_boolean("b1", true);
            db.validate(ev).should.be.eql([]);
            done();
        });
    });
    it("should return error if event not in db", function(done) {
        var db = new EventTemplateDB(file);
        db.initialize(function(err) {
            should.not.exist(err);
            
            var ev = new Event("TestEvent111");
            ev.set_string("k","test");
            ev.set_int32("intkey", 123);
            ev.set_int16("int16key", 1);
            ev.set_uint32_array("ik", [1,2,3,4]);
            ev.set_boolean("b1", true);
            db.validate(ev).should.be.eql(["no event definition for TestEvent111"]);
            done();
        });
    });
    it("should return error for missing required fields", function(done) {
        var db = new EventTemplateDB(file);
        db.initialize(function(err) {
            should.not.exist(err);
            
            var ev = new Event("TestEvent");
            // required: ev.set_string("k","test");
            // required: ev.set_int32("intkey", 123);
            ev.set_int16("int16key", 1);
            ev.set_uint32_array("ik", [1,2,3,4]);
            ev.set_boolean("b1", true);
            db.validate(ev).should.be.eql(["required field missing intkey", "required field missing k"]);
            done();
        });
    });
    it("should return error for array longer than limit", function(done) {
        var db = new EventTemplateDB(file);
        db.initialize(function(err) {
            should.not.exist(err);
            
            var ev = new Event("TestEvent");
            ev.set_string("k","test");
            ev.set_int32("intkey", 123);
            ev.set_int16("int16key", 1);
            ev.set_uint32_array("ik", [1,2,3,4,5,6,7,8,9]);
            ev.set_boolean("b1", true);
            db.validate(ev).should.be.eql(["array larger than limit for ik"]);
            done();
        });
    }); 
    it("should return error for type mismatch", function(done) {
        var db = new EventTemplateDB(file);
        db.initialize(function(err) {
            should.not.exist(err);
            
            var ev = new Event("TestEvent");
            ev.set_float("k","test");
            ev.set_int32("intkey", 123);
            ev.set_int16("int16key", 1);
            ev.set_uint32_array("ik", [1,2,3,4]);
            ev.set_boolean("b1", true);
            db.validate(ev).should.be.eql(["type mismatch for k"]);
            done();
        });
    });
    it("should return error for null value in field with nullable=false", function(done) {
        var db = new EventTemplateDB(file);
        db.initialize(function(err) {
            should.not.exist(err);
            
            var ev = new Event("TestEvent");
            ev.set_string("k",null);
            ev.set_int32("intkey", 123);
            ev.set_int16("int16key", 1);
            ev.set_uint32_array("ik", [1,2,3,4]);
            ev.set_float("f1", null);
            db.validate(ev).should.be.eql(["attribute value null for k"]);
            done();
        });
    });
    it("should inherit from MetaEventInfo", function(done) {
        var db = new EventTemplateDB(file);
        db.initialize(function(err) {
            should.not.exist(err);
            
            var ev = new Event("TestEvent");
            ev.set_string("k","test");
            ev.set_int32("intkey", 123);
            ev.set_int16("int16key", 1);
            ev.set_uint32_array("ik", [1,2,3,4]);
            ev.set_boolean("b1", true);

            // MetaEventInfo:
            ev.set_ipaddr("SenderIP","127.0.0.1");
            ev.set_uint16("SenderPort",1111);

            db.validate(ev).should.be.eql([]);
            done();
        });
    });
 
});
