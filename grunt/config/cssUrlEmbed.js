/**
 * cssUrlEmbed.js - config for grunt-css-url-embed
 */

module.exports = function (grunt, options) {

    var paths  = grunt.fcoo.paths;

    return {
        options: {
            failOnMissingUrl  : false,
            //skipUrlsLargerThan: '100 kb'
        },
        encode: {
            src : paths.temp_dist_APPLICATIONNAME_TIMPSTAMP_css, 
            dest: paths.temp_dist_APPLICATIONNAME_TIMPSTAMP_css
        }           
    }
}