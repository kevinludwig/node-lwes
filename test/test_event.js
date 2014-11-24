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
    lwes = require('../index');

describe("Event", function() {
    var ip = '224.1.1.1';
    var port = '9191';
    var emitter = null;
    before(function() {
        emitter = new lwes.UnicastEmitter(ip,port);
    });
    after(function() {
        emitter.close();
    });
    it("should emit name", function(done) {
        var ev = new lwes.Event('MyEvent'); 
        ev.set_string('k', 'test'); 

        var listener = new lwes.Listener(ip,port);
        listener.listen(function(err,ev) {
            should.not.exist(err);
            ev.should.have.property('name');
            ev.name.should.be.eql('MyEvent');
            Object.keys(ev.attributes).length.should.be.eql(1);
            ev.get('k').should.be.eql("test");
            listener.close();
            done();
        });
        emitter.emit(ev);
    });
    it("should allow name to reset", function(done) {
        var ev = new lwes.Event('MyEvent'); 
        ev.set_string('somekey', 'test string'); 
        ev.setEventName('MyEvent123456789');

        var listener = new lwes.Listener(ip,port);
        listener.listen(function(err,ev) {
            should.not.exist(err);
            ev.should.have.property('name');
            ev.name.should.be.eql('MyEvent123456789');
            Object.keys(ev.attributes).length.should.be.eql(1);
            ev.get('somekey').should.be.eql("test string");
            listener.close();
            done();
        });
        emitter.emit(ev);
    });
    it("should clear attributes", function(done) {
        var ev = new lwes.Event('MyEvent'); 
        ev.set_string('test', 'test value'); 
        ev.set_int32('k',-12345);
        ev.clear('test');

        var listener = new lwes.Listener(ip,port);
        listener.listen(function(err,ev) {
            should.not.exist(err);
            ev.should.have.property('name');
            Object.keys(ev.attributes).length.should.be.eql(1);
            should.not.exist(ev.get('test')); 
            ev.get('k').should.be.eql(-12345);
            listener.close();
            done();
        });
        emitter.emit(ev);
    });
 
    it("should use encoding if present", function(done) {
        var ev = new lwes.Event('MyEvent'); 
        ev.set_uint16('enc', 1); 

        var listener = new lwes.Listener(ip,port);
        listener.listen(function(err,ev) {
            should.not.exist(err);
            Object.keys(ev.attributes).length.should.be.eql(0);
            ev.encoding.should.be.eql(1);
            listener.close();
            done();
        });
        emitter.emit(ev);
    });
});
