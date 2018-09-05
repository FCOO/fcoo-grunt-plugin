/**
 * critical.js - config for grunt-critical
 */

module.exports = function ( grunt ) {

    var paths   = grunt.fcoo.paths,
        options = grunt.fcoo.options;

    return {
        build: {
            options: {
                maxImageFileSize: 100000,
                css             : paths.temp_dist_APPLICATIONNAME_TIMPSTAMP_css,

                inline          : true,             // true = Inline the generated critical-path CSS - true generates HTML - false generates CSS
                extract         : true,             // true = Extract inlined styles from referenced stylesheets
                minify          : options.notDEBUG, // true = Minify critical-path CSS when inlining
            },
            src : paths.temp_dist + 'index.html',
            dest: paths.temp_dist + 'index.html'
        }
    }
}