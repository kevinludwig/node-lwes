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

describe("MulticastEmitter", function() {
    var ip = '224.1.1.1';
    var port = '9191';
    var ttl = 1;
    it("should emit", function(done) {
        var emitter = new lwes.MulticastEmitter(ip,port,ttl, function() {
            var ev = new lwes.Event('MyEvent'); 
            ev.set_string('k', 'test'); 

            var listener = new lwes.Listener(ip,port);
            listener.listen(function(err,ev) {
                should.not.exist(err);
                ev.should.have.property('name');
                ev.name.should.be.eql('MyEvent');
                Object.keys(ev.attributes).length.should.be.eql(3+1);
                ev.get('k').should.be.eql("test");
                listener.close();
                emitter.close();
                done();
            });
            emitter.emit(ev);
        });
    });
});
