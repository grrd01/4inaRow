module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        terser: {
            one: {
                options: {
                    compress: true,
                    mangle: true,
                    output: {
                        comments: 'some'
                    }
                },
                files: {
                    'dist/Scripts/4inaRow.js': ['Scripts/4inaRow.js']
                }
            },
            two: {
                options: {
                    compress: true,
                    mangle: true,
                    output: {
                        comments: 'some'
                    }
                },
                files: {
                    'dist/sw.js': ['sw.js']
                }
            },
        },
        uglify: {
            one: {
                options: {
                    banner: "/*\n* Copyright (c) 2011-2013 Fabien Cazenave, Mozilla.\n*/\n",
                    mangle: true,
                    compress: true
                },
                files: {
                    'dist/Scripts/l10n.js': ['Scripts/l10n.js']
                }
            },
            two: {
                options: {
                    banner: "/*\n* Javascript EXIF Reader 0.1.4\n* Copyright (c) 2008 Jacob Seidelin, cupboy@gmail.com, http://blog.nihilogic.dk/\n* Licensed under the MIT License (MIT) [https://github.com/exif-js/exif-js/blob/master/LICENSE.md]\n*/\n",
                    mangle: true,
                    compress: true
                },
                files: {
                    'dist/Scripts/exif.js': ['Scripts/exif.js']
                }
            },
            three: {
                options: {
                    banner: "/*\n* Socket.IO.js build:0.9.16, development. \n* Copyright(c) 2011 LearnBoost <dev@learnboost.com>\n* MIT Licensed \n*/\n",
                    mangle: true,
                    compress: true
                },
                files: {
                    'dist/Scripts/socket.io.js': ['Scripts/socket.io.js']
                }
            }
        },
        svgmin: {
            options: {
                plugins: [
                    {removeUnknownsAndDefaults: false},
                    {removeViewBox: false}
                ]
            },
            dist: {
                files: [
                    {'dist/Images/2online.svg': 'Images/2online.svg'},
                    {'dist/Images/2player.svg': 'Images/2player.svg'},
                    {'dist/Images/41.svg': 'Images/41.svg'},
                    {'dist/Images/42.svg': 'Images/42.svg'},
                    {'dist/Images/43.svg': 'Images/43.svg'},
                    {'dist/Images/44.svg': 'Images/44.svg'},
                    {'dist/Images/back.svg': 'Images/back.svg'},
                    {'dist/Images/computer.svg': 'Images/computer.svg'},
                    {'dist/Images/dice.svg': 'Images/dice.svg'},
                    {'dist/Images/down.svg': 'Images/down.svg'},
                    {'dist/Images/easy.svg': 'Images/easy.svg'},
                    {'dist/Images/hard.svg': 'Images/hard.svg'},
                    {'dist/Images/info.svg': 'Images/info.svg'},
                    {'dist/Images/mail.svg': 'Images/mail.svg'},
                    {'dist/Images/medium.svg': 'Images/medium.svg'},
                    {'dist/Images/memo.svg': 'Images/memo.svg'},
                    {'dist/Images/ok.svg': 'Images/ok.svg'},
                    {'dist/Images/online.svg': 'Images/online.svg'},
                    {'dist/Images/player.svg': 'Images/player.svg'},
                    {'dist/Images/puzzle.svg': 'Images/puzzle.svg'},
                    {'dist/Images/reversi.svg': 'Images/reversi.svg'},
                    {'dist/Images/search.svg': 'Images/search.svg'},
                    {'dist/Images/settings.svg': 'Images/settings.svg'},
                    {'dist/Images/stats.svg': 'Images/stats.svg'},
                    {'dist/Images/tictactoe.svg': 'Images/tictactoe.svg'},
                    {'dist/Images/x.svg': 'Images/x.svg'}
                ]
            }
        },
        imagemin: {
            dist: {
                options: {
                    optimizationLevel: 5
                },
                files: [{
                    expand: true,
                    cwd: 'Images',
                    src: ['*.{png,jpg,gif}'],
                    dest: 'dist/Images/'
                }]
            },
            dist2: {
                options: {
                    optimizationLevel: 5
                },
                files: [{
                    expand: true,
                    cwd: 'Scripts/images',
                    src: ['*.{png,jpg,gif}'],
                    dest: 'dist/Scripts/images/'
                }]
            }
        },
        cssmin: {
            dist: {
                options: {
                    banner: "/*\n* grrd's 4inaRow\n* Copyright (c) 2012 Gerard Tyedmers, grrd@gmx.net\n* Licensed under the MPL License\n*/\n"
                },
                files: {
                    'dist/Scripts/4inaRow.css': ['Scripts/4inaRow.css']
                }
            },dist2: {
                files: {
                    'dist/Scripts/flags32.css': ['Scripts/flags32.css']
                }
            }
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: [{
                    expand: true,
                    src: 'index.html',
                    dest: 'dist'
                }]
            }
        },
        replace: {
            dist: {
                options: {
                    patterns: [
                        {
                            match: /\<\!DOCTYPE html\>/g,
                            replacement: function () {
                                return "<!DOCTYPE html>\n<!-- \n* grrd's 4 in a Row \n* Copyright (c) 2012 Gerard Tyedmers, grrd@gmx.net \n* Licensed under the MPL License\n-->\n";
                            }
                        }
                    ]
                },
                files: [
                    {expand: true, flatten: true, src: ['dist/index.html'], dest: 'dist/'}
                ]
            }
        },
        copy: {
            main: {
                files: [
                    {expand: true, src: ['Locales/**'], dest: 'dist/'},
                    {expand: true, flatten: true, src: ['Manifest/*'], dest: 'dist/Manifest/'},
                    {expand: true, flatten: true, src: ['Images/*.ico'], dest: 'dist/Images/'},
                    {expand: true, flatten: true, src: ['Scripts/jquery*.*'], dest: 'dist/Scripts/'},
                    {expand: true, flatten: true, src: ['Sounds/*'], dest: 'dist/Sounds/'},
                    {expand: true, flatten: true, src: ['**.txt'], dest: 'dist/'},
                    {expand: true, flatten: true, src: ['**.md'], dest: 'dist/'}
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', [
        'terser',
        'uglify',
        'svgmin',
        'imagemin',
        'cssmin',
        'htmlmin',
        'replace',
        'copy'
    ]);


};
