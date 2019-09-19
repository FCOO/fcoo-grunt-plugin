/**
 * test.js - config for grunt-image-embed
 */

module.exports = function ( grunt ) {

    var paths  = grunt.fcoo.paths;

    return {
        options: {
            deleteAfterEncoding : false
        },
        src : paths.temp_dist_APPLICATIONNAME_TIMPSTAMP_min_css,
        dest: paths.temp_dist_APPLICATIONNAME_TIMPSTAMP_min_css
    }
}