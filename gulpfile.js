const gulp        = require('gulp');

const { series }  = require('gulp');
const { watch }   = require('gulp');

const path        = require('path');
const pump        = require('pump');
const fs          = require('fs');
const del         = require('del');

const now = Date.now();

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


// Empty the CSS folder.
function empty_css_output(cb) {
    del.sync([css_dest + '*.*']);
    cb();
}


// Compile SCSS in expanded mode so it's easier to inspect the result.
//'!./{bower_components,bower_components/**,node_modules,node_modules/**}'
function do_sass(cb) {
    console.log('Running sass...');

    pump([
        gulp.src([
            './_styles/**/*.scss'
        ]),
        sass({outputStyle: 'expanded'}),
        gulp.dest((file) => {
            return file.base;
        })
    ],
    cb);
}


// Then create a minified version in the output folder for the site, and cache-bust.
function do_cssmin(cb) {
    console.log('Running cssmin...');

    pump([
        gulp.src('_styles/**/*.css'),
        cssmin(),
        rename({extname: '.min.css'}),
        gulp.dest((file) => {
            //return css_dest;

            fs.writeFile('./_data/cache_bust_css.yml', 'date: ' + now, (err) => {
                if (err) throw err;
            });
            return css_dest;
        }),
        rename({suffix: '.' + now}),
        gulp.dest(css_dest)
    ],
    cb);
}



// And the same for dev.
function do_devsass(cb) {
    console.log('Running devsass...');

    pump([
        gulp.src([
            './dev/**/*.scss'
        ], {base: process.cwd()}),
        sass({outputStyle: 'expanded'}),
        rename((path) => {
            path.dirname += "/css";
        }),
        gulp.dest((file) => {
            return file.base;
        })
    ],
    cb);
}

// And create a minified version in the same folder for dev.
function do_devcssmin(cb) {
    console.log('Running devcssmin...');

    pump([
        gulp.src('./dev/**/!(*.min)*.css'),
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

exports.devsass   = do_devsass;
exports.devcssmin = do_devcssmin;

exports.empty_css_output = empty_css_output;

// This combined task makes it convenient to run all the steps together.
exports.css = (empty_css_output, do_sass, do_cssmin, do_devsass, do_devcssmin);



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