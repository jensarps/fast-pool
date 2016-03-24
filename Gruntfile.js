/*global module,require */
module.exports = function (grunt) {

    'use strict';

    var pkg = grunt.file.readJSON('package.json');

    var source = 'src/fast-pool.js';


    grunt.initConfig({

        pkg: pkg,

        jshint: {
            all: source,
            options: {
                jshintrc: '.jshintrc'
            }
        },

        jsdoc: {
            dist: {
                src: source,
                options: {
                    destination: 'reference/',
                    private: false,
                    template: './node_modules/ink-docstrap/template',
                    configure: 'conf.json'
                }
            }
        },

        closurecompiler: {
            minify: {
                files: {
                    'dist/fast-pool.min.js': source
                },
                options: {
                    'compilation_level': 'SIMPLE_OPTIMIZATIONS'
                }
            }
        },

        karma: {
            postbuild: {
                configFile: 'karma.conf.js'
            },
            dev: {
                configFile: 'karma.conf.js',
                files: {
                    src: [
                        'idbstore.js',
                        'test/**/*spec.js'
                    ]
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-closurecompiler');
    //grunt.loadNpmTasks('grunt-karma');

};
