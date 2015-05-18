/* ---------------------------------------------------------------------------------------------- *\
NOTES
\* ---------------------------------------------------------------------------------------------- */

module.exports = function(grunt) {

    var grunt_config = {
    
        pkg: grunt.file.readJSON('package.json'),
                
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
                        cwd: "./",
                        src: ["**/*.scss"],
                        dest: "./",
                        ext: ".css"
                    }
                ]
                /*files: {
                    '** /*.css': '** /*.scss'
                }*/
            } 
        },

        // https://github.com/gruntjs/grunt-contrib-watch
        // Order is important here:
        watch: {
            css: {
                files: ['_styles/**/*.scss'],
                tasks: ['sass'],
                options: {
                    spawn: false
                }
            }
        }

    };
    
    grunt.initConfig(grunt_config);

    grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	
    
    /* ----------------------------------------------------------------------------------------- *\
        NOTE:
        Removing autoprefixer for now as Fall Back, Inuit and Scut include prefixes I don't want 
        tampered with.
        Other CSS _MAY_ need this, so I'd have to compile those separately WITH autoprefixer
        then run a CONCAT to join them together before miniying.
        DO THIS as and when.
    
    \* ----------------------------------------------------------------------------------------- */
    
    
    grunt.registerTask('default', ['watch']);

    grunt.registerTask('css', ['sass']); 
    
};
