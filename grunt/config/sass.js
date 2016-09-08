/**
 * sass.js - config for grunt-sass
 */

module.exports = function ( grunt ) {

    var common = grunt.fcoo.common,
        paths  = grunt.fcoo.paths,
        lodash = require('lodash');

    var Temp_2_TempDist     = { expand: true, cwd: paths.temp, dest: paths.temp_dist },                     //temp/**/*.* => temp_dist/**/*.*
        sass_2_css          = { src: common.srcExclude_('**/*.scss'), ext: '.css', expand: true  },         //*.scss => *.css
        AppStyle_scss_2_css = lodash.merge( {cwd: paths.app_styles, dest: paths.app_styles }, sass_2_css ), //app/styles/*.scss => app/styles/*.css
        Temp_scss_2_css     = lodash.merge( {cwd: paths.temp,       dest: paths.temp       }, sass_2_css ); //temp/*.scss => temp/*.css

    return {
        //check: Check syntax - no files generated
        check: {
            options    : {
                noCache   : true,
                sourcemap : 'none',
                check     : true,
                update    : true,
            },
            files: [AppStyle_scss_2_css],
        },

        //compile: Generate css-files with debug-info in same folder as scss-files
        compile: {
            options: {
                sourceMap   : true,
                debugInfo   : true,
                lineNumbers : true,
                update      : false,
                style       : 'expanded',
            },
            files: [AppStyle_scss_2_css],
        },

        //build: Generate 'normal' css-files in same folder as scss-files
        build: {
            options: {
                debugInfo   : false,
                lineNumbers : false,
                update      : false,
                noCache     : true,
                sourcemap   : 'none',
                style       : 'nested',
            },
            files: [Temp_scss_2_css]
        }
    }
}