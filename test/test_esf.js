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
    esfparser = require('../lib/esf-parser');

describe("ESF Parser", function() {
    it("should return a db", function(done) {
        esfparser(path.join(__dirname, "file.esf"), function(err,db) {
            should.not.exist(err);
            should.exist(db);
            db.should.have.property("TestEvent");
            db.TestEvent.should.have.property("k");
            db.TestEvent.k.typeName.should.be.eql("string");
            db.TestEvent.k.required.should.be.eql(true);
            db.TestEvent.intkey.typeName.should.be.eql("int32");
            db.TestEvent.int16key.typeName.should.be.eql("int16");
            done();
        });
    });
});
