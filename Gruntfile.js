module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            files: ['Gruntfile.js', 'index.js', 'lib/**/*.js', 'test/**/*.js']
        },
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

    grunt.loadNpmTasks('grunt-mocha-istanbul');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('default', ['jshint','mocha_istanbul']);
};
