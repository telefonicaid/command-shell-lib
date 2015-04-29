/*
 * Copyright 2014 Telefonica Investigación y Desarrollo, S.A.U
 *
 * This file is part of iotagent-lwm2m-lib
 *
 * iotagent-lwm2m-lib is free software: you can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the License,
 * or (at your option) any later version.
 *
 * iotagent-lwm2m-lib is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with iotagent-lwm2m-lib.
 * If not, seehttp://www.gnu.org/licenses/.
 *
 * For those usages not covered by the GNU Affero General Public License
 * please contact with::[contacto@tid.es]
 */
'use strict';

var commandNode = require('../../'),
    utils = require('util'),
    should = require('should'),
    commands = {
        'create': {
            parameters: ['objectUri', 'objectValue'],
            description: '\tCreate a new object. The object is specified using the /type/id OMA notation.',
            handler: function() {}
        }
    };

function StringWriter() {
    var content = '';

    return {
        log: function() {
            var formatString = arguments[0],
                values = Array.prototype.slice.call(arguments, 1),
                formatted = utils.format.apply(null, [formatString].concat(values));

            content = content + formatted;
        },
        get: function() {
            return content;
        },
        reset: function() {
            content = '';
        }
    };
}

describe('Command-line tool', function() {
    var writer = new StringWriter();

    beforeEach(function() {
        commandNode.initialize(commands, 'Test>', process.stdin, process.stdout);
        commandNode.setWriter(writer);
        commands.create.handler = function() {};
    });

    afterEach(function() {
        commandNode.destroy();
    });

    describe('When the "help" command is executed', function() {
        it('should show all the available commands', function(done) {
            writer.reset();
            process.stdin.push('help\n');
            writer.get().should.match(/.*create <objectUri> <objectValue>.*/);
            done();
        });
    });
    describe('When a command is executed with the right parameters', function() {
        it('should called its handler with the passed parameters', function(done) {
            commands.create.handler = function(commands) {
                should.exist(commands);
                commands.length.should.equal(2);
                commands[0].should.equal('thisIsTheUri');
                commands[1].should.equal('thisIsTheValue');
                done();
            };

            process.stdin.push('create thisIsTheUri thisIsTheValue\n');
        });
    });
    describe.only('When a command is executed with a wrong number of parameters', function() {
        it('should show an error', function(done) {
            writer.reset();
            process.stdin.push('create thisIsTheUri\n');
            writer.get().should.match(/.*Wrong number of parameters.*/);
            done();
        });
    });

});
