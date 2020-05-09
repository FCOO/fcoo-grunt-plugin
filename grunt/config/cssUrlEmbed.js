/**
 * cssUrlEmbed.js - config for grunt-css-url-embed
 */

module.exports = function ( grunt ) {

    var paths  = grunt.fcoo.paths;

    return {
        options: {
            failOnMissingUrl  : false,
            skipUrlsLargerThan: '10 kb'
        },
        encode: {
            src : paths.temp_dist_APPLICATIONNAME_TIMPSTAMP_min_css,
            dest: paths.temp_dist_APPLICATIONNAME_TIMPSTAMP_min_css
        }
    }
}