/*======================================================================*
 *  Copyright (c) 2014, Kevin Ludwig, All rights reserved.              *
 *                                                                      *
 *  Licensed under the New BSD License (the "License"); you may not use *
 *  this file except in compliance with the License. Unless required    *
 *  by applicable law or agreed to in writing, software distributed     *
 *  under the License is distributed on an "AS IS" BASIS, WITHOUT       *
 *  WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.    *
 *  See the License for the specific language governing permissions and *
 *  limitations under the License. See accompanying LICENSE file.       *
 * =====================================================================*/

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            files: ['Gruntfile.js', 'index.js', 'lib/**/*.js', 'test/**/*.js']
        },
        clean: ["coverage"],
        mocha_istanbul: {
            coverage: {
                src: 'test',
                options: {
                    'report-formats': 'text-summary',
                    print: 'summary',
                    check: {
                        lines: 90,
                        functions: 90,
                        statements: 90,
                        branches: 80
                    }
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-mocha-istanbul');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    
    grunt.registerTask('default', ['clean', 'jshint','mocha_istanbul']);
};
