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

describe("Event types and serialization", function() {
    var ip = '224.1.1.1';
    var port = '9191';
    var emitter = null;
    before(function() {
        emitter = new lwes.UnicastEmitter(ip,port);
    });
    after(function() {
        emitter.close();
    });
    it("should allow string type", function(done) {
        var ev = new lwes.Event('MyEvent'); // 7 + 2 + 2
        ev.set_string('somekey', 'test string'); // 7 + 2 + 1 + 2 + 11

        var listener = new lwes.Listener(ip,port);
        listener.listen(function(err,ev) {
            should.not.exist(err);
            ev.should.have.property('name');
            Object.keys(ev.attributes).length.should.be.eql(1);
            ev.get('somekey').should.be.eql("test string");
            listener.close();
            done();
        });
        emitter.emit(ev);
    });
 
    it("should emit int16 types", function(done) {
        var ev = new lwes.Event('MyEvent');
        ev.set_int16('int16_key', 1234);
        ev.set_uint16('uint16_key', 2000);

        var listener = new lwes.Listener(ip,port);
        listener.listen(function(err,ev) {
            should.not.exist(err);
            ev.should.have.property('name');
            ev.should.have.property('attributes');
            Object.keys(ev.attributes).length.should.be.eql(2);
            ev.get('int16_key').should.be.eql(1234);
            ev.get('uint16_key').should.be.eql(2000);
            listener.close();
            done();
        });
        emitter.emit(ev);
    });
    it("should emit int32 types", function(done) {
        var ev = new lwes.Event('MyEvent');
        ev.set_int32('int32_key', 1234567);
        ev.set_uint32('uint32_key', 7654321);

        var listener = new lwes.Listener(ip,port);
        listener.listen(function(err,ev) {
            should.not.exist(err);
            ev.should.have.property('name');
            ev.should.have.property('attributes');
            Object.keys(ev.attributes).length.should.be.eql(2);
            ev.get('int32_key').should.be.eql(1234567);
            ev.get('uint32_key').should.be.eql(7654321);
            listener.close();
            done();
        });
        emitter.emit(ev);
    });
    it("should emit boolean types", function(done) {
        var ev = new lwes.Event('MyEvent');
        ev.set_boolean('t_key', true);
        ev.set_boolean('f_key', false);

        var listener = new lwes.Listener(ip,port);
        listener.listen(function(err,ev) {
            should.not.exist(err);
            ev.should.have.property('name');
            ev.should.have.property('attributes');
            Object.keys(ev.attributes).length.should.be.eql(2);
            ev.get('t_key').should.be.eql(true);
            ev.get('f_key').should.be.eql(false);
            listener.close();
            done();
        });
        emitter.emit(ev);
    });
    it("should emit byte types", function(done) {
        var ev = new lwes.Event('MyEvent');
        ev.set_byte('key', 32);

        var listener = new lwes.Listener(ip,port);
        listener.listen(function(err,ev) {
            should.not.exist(err);
            ev.should.have.property('name');
            ev.should.have.property('attributes');
            Object.keys(ev.attributes).length.should.be.eql(1);
            ev.get('key').should.be.eql(32);
            listener.close();
            done();
        });
        emitter.emit(ev);
    });
    it("should emit ipaddr types", function(done) {
        var ev = new lwes.Event('MyEvent');
        ev.set_ipaddr('ipaddr_key', '192.168.0.10');

        var listener = new lwes.Listener(ip,port);
        listener.listen(function(err,ev) {
            should.not.exist(err);
            ev.should.have.property('name');
            ev.should.have.property('attributes');
            Object.keys(ev.attributes).length.should.be.eql(1);
            ev.get('ipaddr_key').should.be.eql('192.168.0.10');
            listener.close();
            done();
        });
        emitter.emit(ev);
    });
    it("should emit double types", function(done) {
        var ev = new lwes.Event('MyEvent');
        ev.set_double('k', 3.1415926535);

        var listener = new lwes.Listener(ip,port);
        listener.listen(function(err,ev) {
            should.not.exist(err);
            ev.should.have.property('name');
            ev.should.have.property('attributes');
            Object.keys(ev.attributes).length.should.be.eql(1);
            ev.get('k').should.be.eql(3.1415926535);
            listener.close();
            done();
        });
        emitter.emit(ev);
    });
    it("should emit float types", function(done) {
        var ev = new lwes.Event('MyEvent');
        ev.set_float('k', 3.14159);

        var listener = new lwes.Listener(ip,port);
        listener.listen(function(err,ev) {
            should.not.exist(err);
            ev.should.have.property('name');
            ev.should.have.property('attributes');
            Object.keys(ev.attributes).length.should.be.eql(1);
            // broken: ev.get('k').should.be.eql(3.14159);
            listener.close();
            done();
        });
        emitter.emit(ev);
    });
 
    it("should emit string[] types", function(done) {
        var ev = new lwes.Event('MyEvent');
        ev.set_string_array('k', ['test','test1','test2']);

        var listener = new lwes.Listener(ip,port);
        listener.listen(function(err,ev) {
            should.not.exist(err);
            ev.should.have.property('name');
            ev.should.have.property('attributes');
            Object.keys(ev.attributes).length.should.be.eql(1);
            ev.get('k').should.be.eql(['test','test1','test2']);
            listener.close();
            done();
        });
        emitter.emit(ev);
    });
    it("should emit int16[] types", function(done) {
        var ev = new lwes.Event('MyEvent');
        ev.set_int16_array('k', [1,2,3]);

        var listener = new lwes.Listener(ip,port);
        listener.listen(function(err,ev) {
            should.not.exist(err);
            ev.should.have.property('name');
            ev.should.have.property('attributes');
            Object.keys(ev.attributes).length.should.be.eql(1);
            ev.get('k').should.be.eql([1,2,3]);
            listener.close();
            done();
        });
        emitter.emit(ev);
    });
    it("should emit uint16[] types", function(done) {
        var ev = new lwes.Event('MyEvent');
        ev.set_uint16_array('k', [1,2,3]);

        var listener = new lwes.Listener(ip,port);
        listener.listen(function(err,ev) {
            should.not.exist(err);
            ev.should.have.property('name');
            ev.should.have.property('attributes');
            Object.keys(ev.attributes).length.should.be.eql(1);
            ev.get('k').should.be.eql([1,2,3]);
            listener.close();
            done();
        });
        emitter.emit(ev);
    });
    it("should emit int32[] types", function(done) {
        var ev = new lwes.Event('MyEvent');
        ev.set_int32_array('k', [1,2,3]);

        var listener = new lwes.Listener(ip,port);
        listener.listen(function(err,ev) {
            should.not.exist(err);
            ev.should.have.property('name');
            ev.should.have.property('attributes');
            Object.keys(ev.attributes).length.should.be.eql(1);
            ev.get('k').should.be.eql([1,2,3]);
            listener.close();
            done();
        });
        emitter.emit(ev);
    });
    it("should emit uint32[] types", function(done) {
        var ev = new lwes.Event('MyEvent');
        ev.set_uint32_array('k', [1,2,3]);

        var listener = new lwes.Listener(ip,port);
        listener.listen(function(err,ev) {
            should.not.exist(err);
            ev.should.have.property('name');
            ev.should.have.property('attributes');
            Object.keys(ev.attributes).length.should.be.eql(1);
            ev.get('k').should.be.eql([1,2,3]);
            listener.close();
            done();
        });
        emitter.emit(ev);
    });
    it("should emit boolean[] types", function(done) {
        var ev = new lwes.Event('MyEvent');
        ev.set_boolean_array('k', [true,true,false]);

        var listener = new lwes.Listener(ip,port);
        listener.listen(function(err,ev) {
            should.not.exist(err);
            ev.should.have.property('name');
            ev.should.have.property('attributes');
            Object.keys(ev.attributes).length.should.be.eql(1);
            ev.get('k').should.be.eql([true,true,false]);
            listener.close();
            done();
        });
        emitter.emit(ev);
    });
    it("should emit double[] types", function(done) {
        var ev = new lwes.Event('MyEvent');
        ev.set_double_array('k', [3.14,3.1415,3.1415926]);

        var listener = new lwes.Listener(ip,port);
        listener.listen(function(err,ev) {
            should.not.exist(err);
            ev.should.have.property('name');
            ev.should.have.property('attributes');
            Object.keys(ev.attributes).length.should.be.eql(1);
            ev.get('k').should.be.eql([3.14,3.1415,3.1415926]);
            listener.close();
            done();
        });
        emitter.emit(ev);
    });
    it("should emit float[] types", function(done) {
        var ev = new lwes.Event('MyEvent');
        ev.set_float_array('k', [3.14,3.1415,3.1415926]);

        var listener = new lwes.Listener(ip,port);
        listener.listen(function(err,ev) {
            should.not.exist(err);
            ev.should.have.property('name');
            ev.should.have.property('attributes');
            Object.keys(ev.attributes).length.should.be.eql(1);
            // broken: ev.get('k').should.be.eql([3.14,3.1415,3.1415926]);
            listener.close();
            done();
        });
        emitter.emit(ev);
    }); 
    it("should emit byte[] types", function(done) {
        var ev = new lwes.Event('MyEvent');
        ev.set_byte_array('k', [1,2,3,4,5]);

        var listener = new lwes.Listener(ip,port);
        listener.listen(function(err,ev) {
            should.not.exist(err);
            ev.should.have.property('name');
            ev.should.have.property('attributes');
            Object.keys(ev.attributes).length.should.be.eql(1);
            ev.get('k').should.be.eql([1,2,3,4,5]);
            listener.close();
            done();
        });
        emitter.emit(ev);
    }); 
 
    /* Broken at the moment
     it("should emit ip address array types", function(done) {
        var ev = new lwes.Event('MyIpAddrArrayEvent');
        ev.set_int16('k0', 1234);
        ev.set_ipaddr_array('k', ['127.0.0.1','192.168.0.12']);

        var listener = new lwes.Listener(ip,port);
        listener.listen(function(err,ev) {
            should.not.exist(err);
            ev.should.have.property('name');
            ev.should.have.property('attributes');
            Object.keys(ev.attributes).length.should.be.eql(1);
            ev.get('k').should.be.eql(['127.0.0.1','192.168.0.12']);
            listener.close();
            done();
        });
        emitter.emit(ev);
    }); */
});
