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
    bignum = require('bignum'),
    lwes = require('../index');

describe("Event types and serialization", function() {
    var ip = '224.1.1.1';
    var port = '9191';
    var emitter = null;
    before(function() {
        emitter = new lwes.UnicastEmitter(ip,port);
    });
    after(function() {
        emitter.destroy();
    });
    it("should allow string type", function(done) {
        var ev = emitter.createEvent('MyEvent'); // 7 + 2 + 2
        ev.set_string('somekey', 'test string'); // 7 + 2 + 1 + 2 + 11

        var listener = new lwes.Listener(ip,port);
        listener.listen(function(err,ev) {
            if (ev.name === 'System::Startup') return;
            should.not.exist(err);
            ev.should.have.property('name');
            Object.keys(ev.attributes).length.should.be.eql(3+1);
            ev.get('somekey').should.be.eql("test string");
            listener.destroy();
            done();
        });
        emitter.emit(ev);
    });
 
    it("should emit int16 types", function(done) {
        var ev = emitter.createEvent('MyEvent');
        ev.set_int16('int16_key', 1234);
        ev.set_uint16('uint16_key', 2000);

        var listener = new lwes.Listener(ip,port);
        listener.listen(function(err,ev) {
            should.not.exist(err);
            ev.should.have.property('name');
            ev.should.have.property('attributes');
            Object.keys(ev.attributes).length.should.be.eql(3+2);
            ev.get('int16_key').should.be.eql(1234);
            ev.get('uint16_key').should.be.eql(2000);
            listener.destroy();
            done();
        });
        emitter.emit(ev);
    });
    it("should emit int32 types", function(done) {
        var ev = emitter.createEvent('MyEvent');
        ev.set_int32('int32_key', 1234567);
        ev.set_uint32('uint32_key', 7654321);

        var listener = new lwes.Listener(ip,port);
        listener.listen(function(err,ev) {
            should.not.exist(err);
            ev.should.have.property('name');
            ev.should.have.property('attributes');
            Object.keys(ev.attributes).length.should.be.eql(3+2);
            ev.get('int32_key').should.be.eql(1234567);
            ev.get('uint32_key').should.be.eql(7654321);
            listener.destroy();
            done();
        });
        emitter.emit(ev);
    });
    it("should emit int64 types", function(done) {
        var ev = emitter.createEvent('MyEvent');
        ev.set_int64('int64_key', bignum('12345678901234567890'));
        ev.set_uint64('uint64_key', bignum('12345678901234567890'));

        var listener = new lwes.Listener(ip,port);
        listener.listen(function(err,ev) {
            should.not.exist(err);
            ev.should.have.property('name');
            ev.should.have.property('attributes');
            Object.keys(ev.attributes).length.should.be.eql(3+2);
            ev.get('int64_key').should.be.eql(bignum('12345678901234567890'));
            ev.get('uint64_key').should.be.eql(bignum('12345678901234567890'));
            listener.destroy();
            done();
        });
        emitter.emit(ev);
    });
    it("should emit boolean types", function(done) {
        var ev = emitter.createEvent('MyEvent');
        ev.set_boolean('t_key', true);
        ev.set_boolean('f_key', false);

        var listener = new lwes.Listener(ip,port);
        listener.listen(function(err,ev) {
            should.not.exist(err);
            ev.should.have.property('name');
            ev.should.have.property('attributes');
            Object.keys(ev.attributes).length.should.be.eql(3+2);
            ev.get('t_key').should.be.eql(true);
            ev.get('f_key').should.be.eql(false);
            listener.destroy();
            done();
        });
        emitter.emit(ev);
    });
    it("should emit byte types", function(done) {
        var ev = emitter.createEvent('MyEvent');
        ev.set_byte('key', 32);

        var listener = new lwes.Listener(ip,port);
        listener.listen(function(err,ev) {
            should.not.exist(err);
            ev.should.have.property('name');
            ev.should.have.property('attributes');
            Object.keys(ev.attributes).length.should.be.eql(3+1);
            ev.get('key').should.be.eql(32);
            listener.destroy();
            done();
        });
        emitter.emit(ev);
    });
    it("should emit ipaddr types", function(done) {
        var ev = emitter.createEvent('MyEvent');
        ev.set_ipaddr('ipaddr_key', '192.168.0.10');

        var listener = new lwes.Listener(ip,port);
        listener.listen(function(err,ev) {
            should.not.exist(err);
            ev.should.have.property('name');
            ev.should.have.property('attributes');
            Object.keys(ev.attributes).length.should.be.eql(3+1);
            ev.get('ipaddr_key').should.be.eql('192.168.0.10');
            listener.destroy();
            done();
        });
        emitter.emit(ev);
    });
    it("should emit double types", function(done) {
        var ev = emitter.createEvent('MyEvent');
        ev.set_double('k', 3.1415926535);

        var listener = new lwes.Listener(ip,port);
        listener.listen(function(err,ev) {
            should.not.exist(err);
            ev.should.have.property('name');
            ev.should.have.property('attributes');
            Object.keys(ev.attributes).length.should.be.eql(3+1);
            ev.get('k').should.be.eql(3.1415926535);
            listener.destroy();
            done();
        });
        emitter.emit(ev);
    });
    it("should emit float types", function(done) {
        var ev = emitter.createEvent('MyEvent');
        ev.set_float('k', 3.14159);

        var listener = new lwes.Listener(ip,port);
        listener.listen(function(err,ev) {
            should.not.exist(err);
            ev.should.have.property('name');
            ev.should.have.property('attributes');
            Object.keys(ev.attributes).length.should.be.eql(3+1);
            ev.get('k').toFixed(5).should.be.eql('3.14159');
            listener.destroy();
            done();
        });
        emitter.emit(ev);
    });
 
    it("should emit string[] types", function(done) {
        var ev = emitter.createEvent('MyEvent');
        ev.set_string_array('k', ['test','test1','test2']);

        var listener = new lwes.Listener(ip,port);
        listener.listen(function(err,ev) {
            should.not.exist(err);
            ev.should.have.property('name');
            ev.should.have.property('attributes');
            Object.keys(ev.attributes).length.should.be.eql(3+1);
            ev.get('k').should.be.eql(['test','test1','test2']);
            listener.destroy();
            done();
        });
        emitter.emit(ev);
    });
    it("should emit sparse string[] types", function(done) {
        var ev = emitter.createEvent('MyEvent');
        var payload = [null,'test',null,'test1',null,'test2',null];
        ev.set_nstring_array('k', payload);

        var listener = new lwes.Listener(ip,port);
        listener.listen(function(err,ev) {
            should.not.exist(err);
            ev.should.have.property('name');
            ev.should.have.property('attributes');
            Object.keys(ev.attributes).length.should.be.eql(3+1);
            ev.get('k').should.be.eql(payload);
            listener.destroy();
            done();
        });
        emitter.emit(ev);
    });
 
    it("should emit int16[] types", function(done) {
        var ev = emitter.createEvent('MyEvent');
        ev.set_int16_array('k', [1,2,3]);

        var listener = new lwes.Listener(ip,port);
        listener.listen(function(err,ev) {
            should.not.exist(err);
            ev.should.have.property('name');
            ev.should.have.property('attributes');
            Object.keys(ev.attributes).length.should.be.eql(3+1);
            ev.get('k').should.be.eql([1,2,3]);
            listener.destroy();
            done();
        });
        emitter.emit(ev);
    });
    it("should emit sparse int16[] types", function(done) {
        var ev = emitter.createEvent('MyEvent');
        var payload = [null,null,null,1,2,3,4,null,null,null,5,null];
        ev.set_nint16_array('k', payload);

        var listener = new lwes.Listener(ip,port);
        listener.listen(function(err,ev) {
            should.not.exist(err);
            ev.should.have.property('name');
            ev.should.have.property('attributes');
            Object.keys(ev.attributes).length.should.be.eql(3+1);
            ev.get('k').should.be.eql(payload);
            listener.destroy();
            done();
        });
        emitter.emit(ev);
    });
 
    it("should emit uint16[] types", function(done) {
        var ev = emitter.createEvent('MyEvent');
        ev.set_uint16_array('k', [1,2,3]);

        var listener = new lwes.Listener(ip,port);
        listener.listen(function(err,ev) {
            should.not.exist(err);
            ev.should.have.property('name');
            ev.should.have.property('attributes');
            Object.keys(ev.attributes).length.should.be.eql(3+1);
            ev.get('k').should.be.eql([1,2,3]);
            listener.destroy();
            done();
        });
        emitter.emit(ev);
    });
    it("should emit sparse uint16[] types", function(done) {
        var ev = emitter.createEvent('MyEvent');
        var payload = [null,null,null,null,1,null,null,null,null,2,null,null,3];
        ev.set_nuint16_array('k', payload);

        var listener = new lwes.Listener(ip,port);
        listener.listen(function(err,ev) {
            should.not.exist(err);
            ev.should.have.property('name');
            ev.should.have.property('attributes');
            Object.keys(ev.attributes).length.should.be.eql(3+1);
            ev.get('k').should.be.eql(payload);
            listener.destroy();
            done();
        });
        emitter.emit(ev);
    });
 
    it("should emit int32[] types", function(done) {
        var ev = emitter.createEvent('MyEvent');
        ev.set_int32_array('k', [1,2,3]);

        var listener = new lwes.Listener(ip,port);
        listener.listen(function(err,ev) {
            should.not.exist(err);
            ev.should.have.property('name');
            ev.should.have.property('attributes');
            Object.keys(ev.attributes).length.should.be.eql(3+1);
            ev.get('k').should.be.eql([1,2,3]);
            listener.destroy();
            done();
        });
        emitter.emit(ev);
    });
    it("should emit sparse int32[] types", function(done) {
        var ev = emitter.createEvent('MyEvent');
        var payload = [null,null,null,null,1,2,-1,-2,-3,null,null,23000];
        ev.set_nint32_array('k', payload);

        var listener = new lwes.Listener(ip,port);
        listener.listen(function(err,ev) {
            should.not.exist(err);
            ev.should.have.property('name');
            ev.should.have.property('attributes');
            Object.keys(ev.attributes).length.should.be.eql(3+1);
            ev.get('k').should.be.eql(payload);
            listener.destroy();
            done();
        });
        emitter.emit(ev);
    });
 
    it("should emit uint32[] types", function(done) {
        var ev = emitter.createEvent('MyEvent');
        ev.set_uint32_array('k', [1,2,3]);

        var listener = new lwes.Listener(ip,port);
        listener.listen(function(err,ev) {
            should.not.exist(err);
            ev.should.have.property('name');
            ev.should.have.property('attributes');
            Object.keys(ev.attributes).length.should.be.eql(3+1);
            ev.get('k').should.be.eql([1,2,3]);
            listener.destroy();
            done();
        });
        emitter.emit(ev);
    });
 
    it("should emit sparse uint32[] types", function(done) {
        var ev = emitter.createEvent('MyEvent');
        var payload = [null,1,2,3,4,null,null,null,null,null,99100];
        ev.set_nuint32_array('k', payload);

        var listener = new lwes.Listener(ip,port);
        listener.listen(function(err,ev) {
            should.not.exist(err);
            ev.should.have.property('name');
            ev.should.have.property('attributes');
            Object.keys(ev.attributes).length.should.be.eql(3+1);
            ev.get('k').should.be.eql(payload);
            listener.destroy();
            done();
        });
        emitter.emit(ev);
    });

    it("should emit boolean[] types", function(done) {
        var ev = emitter.createEvent('MyEvent');
        ev.set_boolean_array('k', [true,true,false]);

        var listener = new lwes.Listener(ip,port);
        listener.listen(function(err,ev) {
            should.not.exist(err);
            ev.should.have.property('name');
            ev.should.have.property('attributes');
            Object.keys(ev.attributes).length.should.be.eql(3+1);
            ev.get('k').should.be.eql([true,true,false]);
            listener.destroy();
            done();
        });
        emitter.emit(ev);
    });
    
    it("should emit sparse boolean[] types", function(done) {
        var ev = emitter.createEvent('MyEvent');
        var payload = [true,null,null,false,null,null,null,null,null,true];
        ev.set_nboolean_array('k', payload);

        var listener = new lwes.Listener(ip,port);
        listener.listen(function(err,ev) {
            should.not.exist(err);
            ev.should.have.property('name');
            ev.should.have.property('attributes');
            Object.keys(ev.attributes).length.should.be.eql(3+1);
            ev.get('k').should.be.eql(payload);
            listener.destroy();
            done();
        });
        emitter.emit(ev);
    });

    it("should emit double[] types", function(done) {
        var ev = emitter.createEvent('MyEvent');
        ev.set_double_array('k', [3.14,3.1415,3.1415926]);

        var listener = new lwes.Listener(ip,port);
        listener.listen(function(err,ev) {
            should.not.exist(err);
            ev.should.have.property('name');
            ev.should.have.property('attributes');
            Object.keys(ev.attributes).length.should.be.eql(3+1);
            ev.get('k').should.be.eql([3.14,3.1415,3.1415926]);
            listener.destroy();
            done();
        });
        emitter.emit(ev);
    });
    it("should emit sparse double[] types", function(done) {
        var ev = emitter.createEvent('MyEvent');
        var payload = [null,null,null,null,3.14159,null,null,null,null,2.25,null];
        ev.set_ndouble_array('k', payload);

        var listener = new lwes.Listener(ip,port);
        listener.listen(function(err,ev) {
            should.not.exist(err);
            ev.should.have.property('name');
            ev.should.have.property('attributes');
            Object.keys(ev.attributes).length.should.be.eql(3+1);
            ev.get('k').should.be.eql(payload);
            listener.destroy();
            done();
        });
        emitter.emit(ev);
    });
 
    it("should emit float[] types", function(done) {
        var ev = emitter.createEvent('MyEvent');
        ev.set_float_array('k', [3.14,3.1415,3.141592]);

        var listener = new lwes.Listener(ip,port);
        listener.listen(function(err,ev) {
            should.not.exist(err);
            ev.should.have.property('name');
            ev.should.have.property('attributes');
            Object.keys(ev.attributes).length.should.be.eql(3+1);
            ev.get('k').map(function(v) {return v.toFixed(6);}).should.be.eql(['3.140000','3.141500','3.141592']);
            listener.destroy();
            done();
        });
        emitter.emit(ev);
    }); 

    it("should emit sparse float[] types", function(done) {
        var ev = emitter.createEvent('MyEvent');
        var payload = [null,3.25, null, null,null, 8.5, null, null, 1.125,null,null];
        ev.set_nfloat_array('k', payload);

        var listener = new lwes.Listener(ip,port);
        listener.listen(function(err,ev) {
            should.not.exist(err);
            ev.should.have.property('name');
            ev.should.have.property('attributes');
            Object.keys(ev.attributes).length.should.be.eql(3+1);
            ev.get('k').should.be.eql(payload);
            listener.destroy();
            done();
        });
        emitter.emit(ev);
    }); 
 
    it("should emit byte[] types", function(done) {
        var ev = emitter.createEvent('MyEvent');
        ev.set_byte_array('k', [1,2,3,4,5]);

        var listener = new lwes.Listener(ip,port);
        listener.listen(function(err,ev) {
            should.not.exist(err);
            ev.should.have.property('name');
            ev.should.have.property('attributes');
            Object.keys(ev.attributes).length.should.be.eql(3+1);
            ev.get('k').should.be.eql([1,2,3,4,5]);
            listener.destroy();
            done();
        });
        emitter.emit(ev);
    }); 
 
     it("should emit ip address array types", function(done) {
        var ev = emitter.createEvent('MyIpAddrArrayEvent');
        ev.set_ipaddr_array('k', ['127.0.0.1','192.168.0.12']);

        var listener = new lwes.Listener(ip,port);
        listener.listen(function(err,ev) {
            should.not.exist(err);
            ev.should.have.property('name');
            ev.should.have.property('attributes');
            Object.keys(ev.attributes).length.should.be.eql(3+1);
            ev.get('k').should.be.eql(['127.0.0.1','192.168.0.12']);
            listener.destroy();
            done();
        });
        emitter.emit(ev);
    }); 
    it("should emit int64 array types", function(done) {
        var ev = emitter.createEvent('MyInt64Event');
        var bn = bignum('123456789012345');
        ev.set_int64_array('k', [bn,bn.mul(2),bn.mul(4)]);

        var listener = new lwes.Listener(ip,port);
        listener.listen(function(err,ev) {
            should.not.exist(err);
            ev.should.have.property('name');
            ev.should.have.property('attributes');
            Object.keys(ev.attributes).length.should.be.eql(3+1);
            ev.get('k').should.be.eql([bn, bn.mul(2), bn.mul(4)]);
            listener.destroy();
            done();
        });
        emitter.emit(ev);
    }); 
});
