const gulp        = require('gulp');

const { series }  = require('gulp');
const { watch }   = require('gulp');

const pump        = require('pump');


require('make-promises-safe');



/*------------------------------------------------------------------------------------------------*\
    FTP

    Note: this always uploads everything (with obvious exceptions) DELIBERATELY.
    This is because not everything is watched all the time, and I may make changes to unwatched
    files without thinking or remembering to upload them.
    This method ensures that the host will always have the latest files, including THIS.
\*------------------------------------------------------------------------------------------------*/
const ftp         = require( 'vinyl-ftp' );
const ftpcrd      = require('./ftpcrd.json');

var ftp_src = './';


// Upload files
function do_ftp(cb) {
    console.log('Running FTP. See gulpfile.js for details.');

    var conn = ftp.create( {
        host:     ftpcrd.host,
        user:     ftpcrd.user,
        password: ftpcrd.pass,
        parallel: 10
    } );

    pump([
        gulp.src([
            './**',
            '!./{node_modules,node_modules/**}',
            '!./{media,media/**}',
            '!ftpcrd.json'
        ], { base: '.', buffer: false }),
        conn.dest(ftpcrd.dest)
    ],
    cb);
}

exports.ftp = do_ftp;



/*------------------------------------------------------------------------------------------------*\
    CSS
\*------------------------------------------------------------------------------------------------*/
//var css_base = './';
//var css_src  =  ['!node_modules', '!node_modules/**', css_base + '*.scss', css_base + '**/*.scss'];
var css_src  =  './';
var css_dest = './css/';

const sass   = require('gulp-sass');
const cssmin = require('gulp-cssmin');
const rename = require('gulp-rename');


// Compile SCSS in expanded mode so it's easier to inspect the result.
function do_sass(cb) {
    console.log('Running sass...');

    pump([
        gulp.src([
            './**/*.scss',
            '!./{node_modules,node_modules/**}'
        ]),
        sass({outputStyle: 'expanded'}),
        gulp.dest((file) => {
            return file.base;
        })
    ],
    cb);
}


// Then create a minified version in the output folder.
function do_cssmin(cb) {
    console.log('Running cssmin...');

    pump([
        gulp.src(css_dest + '**/!(*.min)*.css'),
        cssmin(),
        rename({extname: '.min.css'}),
        gulp.dest((file) => {
            return file.base;
        })
    ],
    cb);
}


exports.sass   = do_sass;
exports.cssmin = do_cssmin;

// This combined task makes it convenient to run all the steps together.
exports.css = series(do_sass, do_cssmin, do_ftp);



/*------------------------------------------------------------------------------------------------*\
    WATCHERS
\*------------------------------------------------------------------------------------------------*/

// Watch CSS:
function do_watch_css(cb) {
    watch(css_src + '**/*.scss', exports.css);
}
exports.watch_css = do_watch_css;


// Watch all of the above:
function do_watch_all(cb) {
    watch(css_src + '**/*.scss', exports.css);
    //watch(js_src + '** /!(script)*.js', exports.js);
}
exports.watch_all = do_watch_all;


// Watch FTP:
/*gulp.task('watch_ftp', function(){
    gulp.watch(ftp_src + '/** /*', ['ftp']);
});*/


// Watch PHP files:
/*gulp.task('watch_php', function(){
    gulp.watch('./** /*.php', ['ftp']);
});*/
