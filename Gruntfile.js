/* ---------------------------------------------------------------------------------------------- *\
NOTES
\* ---------------------------------------------------------------------------------------------- */

module.exports = function(grunt) {

    var grunt_config = {

        pkg: grunt.file.readJSON('package.json'),

        // https://github.com/gruntjs/grunt-contrib-concat
        concat: {
            js: {
                src: [
                    './_scripts/cookie-notice-settings.js',
                    './bower_components/Fall-Back-Nav-Bar/nav-bar.js',
                    './bower_components/Fall-Back-Over-Panel/over-panel.js',
                    './bower_components/Fall-Back-Cookie-Notice/cookie-notice.js',
                    './bower_components/Fall-Back-SVG/svg.js'
                ],
                dest: './_scripts/script.js'
            }
        },

        // https://github.com/gruntjs/grunt-contrib-cssmin
        cssmin: {
            minify: {
                expand: true,
                cwd: './_styles/',
                src: ['style.css'],
                dest: './css/',
                ext: '.min.css'
            }
        },

        // https://github.com/gruntjs/grunt-contrib-imagemin
        imagemin: {
            dynamic: {
                options: {
                    pngquant: false,
                    optimizationLevel: 1 //Compression level
                },
                files: [{
                    expand: true,
                    cwd: '_images/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: './img/'
                }]
            }
        },

        // https://github.com/yoniholmes/grunt-text-replace
        replace: {
            svg_cleanup: {
                src: ['./img/**/*.svg'],
                overwrite: true,
                replacements: [
                    {
                        from: /(<svg[^>]*) width=".*?" height=".*?"/,
                        to: '$1'
                    },
                    {
                        from: /(<svg[^>]*) enable-background="[^"]*"/,
                        to: '$1'
                    }
                ]
            }
        },

        // https://github.com/gruntjs/grunt-contrib-sass
        // Default precision is 10
        sass: {
            dist: {
                options: {
                    outputStyle: 'expanded',
                    sourceMap: true
                },
                files: [
                    {
                        expand: true,
                        cwd: "./_styles/",
                        src: ["**/*.scss"],
                        dest: "./_styles/",
                        ext: ".css"
                    }
                ]
                /*files: {
                    '** /*.css': '** /*.scss'
                }*/
            }
        },

        // https://npmjs.org/package/grunt-svg2png
        svg2png: {
            all: {
                files: [{
                    src: ['_images/**/*.svg']
                }]
            }
        },

        // https://npmjs.org/package/grunt-svgmin
        svgmin: {
            options: {
                plugins: [{
                    removeViewBox: false,
                    removeUnknownsAndDefaults: false
                }]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '_images/',
                    src: ['**/*.svg'],
                    dest: './img/'
                }]
            }
        },

        // https://github.com/gruntjs/grunt-contrib-uglify
        uglify: {
            build: {
                src: './_scripts/script.js',
                dest: './js/script.min.js'
            }
        },


        // https://github.com/gruntjs/grunt-contrib-watch
        // Order is important here:
        watch: {
            css: {
                files: ['**/*.scss'],
                tasks: ['sass', 'cssmin'], // , 'ftp-deploy'
                options: {
                    spawn: false
                }
            }
        }

    };

    grunt.initConfig(grunt_config);
    // General tools:
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    //grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-text-replace');
    // (S)CSS:
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-sass');
    // JS:
    grunt.loadNpmTasks('grunt-contrib-uglify');
    // SVG/PNG:
    grunt.loadNpmTasks('grunt-svgmin');
    grunt.loadNpmTasks('grunt-svg2png');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    // FTP:
    //grunt.loadNpmTasks('grunt-ftp-deploy');

    /* ----------------------------------------------------------------------------------------- *\
        NOTE:
        Removing autoprefixer for now as Fall-Back includes deliberate prefixes I don't want
        tampered with.
        Other CSS _MAY_ need this, so I'd have to compile those separately WITH autoprefixer
        then run a CONCAT to join them together before miniying.
        DO THIS as and when.

    \* ----------------------------------------------------------------------------------------- */


    grunt.registerTask('default', ['watch']);

    grunt.registerTask('css', ['sass', 'cssmin']);
    grunt.registerTask('js', ['concat', 'uglify']);
    grunt.registerTask('img', ['svg2png', 'imagemin', 'svgmin', 'replace:svg_cleanup']);

    //grunt.registerTask('ftp', ['ftp-deploy']);
};
