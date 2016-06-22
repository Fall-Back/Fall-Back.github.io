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
                    './bower_components/Fall-Back-Cookie-Notice/js/cookie-notice.js',
                    './bower_components/Fall-Back-Base/js/no-history.js'
                ],
                dest: './_scripts/script.js'
            }/*,
            css: {
                src: [
                    'css/normalize.css',
                    'css/foundation.css'
                ],
                dest: 'css/style.css'
            }*/
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
                
        // https://github.com/gruntjs/grunt-contrib-sass
        sass: {
            dist: {
                options: {
                    style: 'expanded',
                    precision: 7
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
        
        // https://github.com/gruntjs/grunt-contrib-uglify
        uglify: {
            build: {
                src: './_scripts/script.js',
                dest: './js/script.min.js'
            }
        },
        /*uglify: {
            min: {
                files: [
                    {
                        expand: true,
                        cwd: "./",
                        src: ["**_____/_scripts/*.js"],
                        dest: "./js/",
                        ext: ".min.js",
                        filter: function (filepath) {
                            return (
                                (filepath.indexOf('node_modules') === -1)
                             && (filepath.indexOf('_archive') === -1)
                             && (filepath != 'Gruntfile.js')
                            );
                        }
                    }
                ]
            }
        },*/

        // https://github.com/gruntjs/grunt-contrib-watch
        // Order is important here:
        watch: {
            css: {
                files: ['**/*.scss'],
                tasks: ['sass', 'cssmin'],
                options: {
                    spawn: false
                }
            }
        }

    };
    
    grunt.initConfig(grunt_config);
    
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-sass');
    
    grunt.loadNpmTasks('grunt-contrib-uglify');
    
    /* ----------------------------------------------------------------------------------------- *\
        NOTE:
        Removing autoprefixer for now as Fall Back, Inuit and Scut include prefixes I don't want 
        tampered with.
        Other CSS _MAY_ need this, so I'd have to compile those separately WITH autoprefixer
        then run a CONCAT to join them together before miniying.
        DO THIS as and when.
    
    \* ----------------------------------------------------------------------------------------- */
    
    
    grunt.registerTask('default', ['watch']);

    grunt.registerTask('css', ['sass', 'cssmin']); 
    grunt.registerTask('js', ['concat', 'uglify']);
    
};
