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
                    '../../2_Build/4inaRow/Scripts/4inaRow.js': ['Scripts/4inaRow.js']
                }
            }
        },
        uglify: {
            one: {
                options: {
                    banner: "/*\n* grrd's 4 in a Row\n* Copyright (c) 2012 Gerard Tyedmers, grrd@gmx.net\n* Licensed under the MPL License\n*/\n",
                    mangle: true,
                    compress: true
                },
                files: {
                    '../../2_Build/4inaRow/sw.js': ['sw.js']
                }
            },
            two: {
                options: {
                    banner: "/*\n* Copyright (c) 2011-2013 Fabien Cazenave, Mozilla.\n*/\n",
                    mangle: true,
                    compress: true
                },
                files: {
                    '../../2_Build/4inaRow/Scripts/l10n.js': ['Scripts/l10n.js']
                }
            },
            three: {
                options: {
                    banner: "/*\n* Javascript EXIF Reader 0.1.4\n* Copyright (c) 2008 Jacob Seidelin, cupboy@gmail.com, http://blog.nihilogic.dk/\n* Licensed under the MIT License (MIT) [https://github.com/exif-js/exif-js/blob/master/LICENSE.md]\n*/\n",
                    mangle: true,
                    compress: true
                },
                files: {
                    '../../2_Build/4inaRow/Scripts/exif.js': ['Scripts/exif.js']
                }
            },
            four: {
                options: {
                    banner: "/*\n* Socket.IO.js build:0.9.16, development. \n* Copyright(c) 2011 LearnBoost <dev@learnboost.com>\n* MIT Licensed \n*/\n",
                    mangle: true,
                    compress: true
                },
                files: {
                    '../../2_Build/4inaRow/Scripts/socket.io.js': ['Scripts/socket.io.js']
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
                    {'../../2_Build/4inaRow/Images/2online.svg': 'Images/2online.svg'},
                    {'../../2_Build/4inaRow/Images/2player.svg': 'Images/2player.svg'},
                    {'../../2_Build/4inaRow/Images/41.svg': 'Images/41.svg'},
                    {'../../2_Build/4inaRow/Images/42.svg': 'Images/42.svg'},
                    {'../../2_Build/4inaRow/Images/43.svg': 'Images/43.svg'},
                    {'../../2_Build/4inaRow/Images/44.svg': 'Images/44.svg'},
                    {'../../2_Build/4inaRow/Images/back.svg': 'Images/back.svg'},
                    {'../../2_Build/4inaRow/Images/computer.svg': 'Images/computer.svg'},
                    {'../../2_Build/4inaRow/Images/dice.svg': 'Images/dice.svg'},
                    {'../../2_Build/4inaRow/Images/down.svg': 'Images/down.svg'},
                    {'../../2_Build/4inaRow/Images/easy.svg': 'Images/easy.svg'},
                    {'../../2_Build/4inaRow/Images/hard.svg': 'Images/hard.svg'},
                    {'../../2_Build/4inaRow/Images/info.svg': 'Images/info.svg'},
                    {'../../2_Build/4inaRow/Images/mail.svg': 'Images/mail.svg'},
                    {'../../2_Build/4inaRow/Images/medium.svg': 'Images/medium.svg'},
                    {'../../2_Build/4inaRow/Images/ok.svg': 'Images/ok.svg'},
                    {'../../2_Build/4inaRow/Images/online.svg': 'Images/online.svg'},
                    {'../../2_Build/4inaRow/Images/player.svg': 'Images/player.svg'},
                    {'../../2_Build/4inaRow/Images/puzzle.svg': 'Images/puzzle.svg'},
                    {'../../2_Build/4inaRow/Images/puzzle_min.svg': 'Images/puzzle_min.svg'},
                    {'../../2_Build/4inaRow/Images/search.svg': 'Images/search.svg'},
                    {'../../2_Build/4inaRow/Images/settings.svg': 'Images/settings.svg'},
                    {'../../2_Build/4inaRow/Images/stats.svg': 'Images/stats.svg'},
                    {'../../2_Build/4inaRow/Images/tictactoe.svg': 'Images/tictactoe.svg'},
                    {'../../2_Build/4inaRow/Images/x.svg': 'Images/x.svg'}
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
                    dest: '../../2_Build/4inaRow/Images/'
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
                    dest: '../../2_Build/4inaRow/Scripts/images/'
                }]
            }
        },
        cssmin: {
            dist: {
                options: {
                    banner: "/*\n* grrd's 4inaRow\n* Copyright (c) 2012 Gerard Tyedmers, grrd@gmx.net\n* Licensed under the MPL License\n*/\n"
                },
                files: {
                    '../../2_Build/4inaRow/Scripts/4inaRow.css': ['Scripts/4inaRow.css']
                }
            },dist2: {
                files: {
                    '../../2_Build/4inaRow/Scripts/flags32.css': ['Scripts/flags32.css']
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
                    dest: '../../2_Build/4inaRow'
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
                    {expand: true, flatten: true, src: ['../../2_Build/4inaRow/index.html'], dest: '../../2_Build/4inaRow/'}
                ]
            }
        },
        copy: {
            main: {
                files: [
                    {expand: true, src: ['Locales/**'], dest: '../../2_Build/4inaRow/'},
                    {expand: true, flatten: true, src: ['Manifest/*'], dest: '../../2_Build/4inaRow/Manifest/'},
                    {expand: true, flatten: true, src: ['Images/*.ico'], dest: '../../2_Build/4inaRow/Images/'},
                    {expand: true, flatten: true, src: ['Scripts/jquery*.*'], dest: '../../2_Build/4inaRow/Scripts/'},
                    {expand: true, flatten: true, src: ['Sounds/*'], dest: '../../2_Build/4inaRow/Sounds/'},
                    {expand: true, flatten: true, src: ['**.txt'], dest: '../../2_Build/4inaRow/'},
                    {expand: true, flatten: true, src: ['**.md'], dest: '../../2_Build/4inaRow/'}
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