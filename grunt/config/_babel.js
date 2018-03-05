/**
 * babel.js - config for grunt-babel
 */

module.exports = function ( grunt ) {

    var options = grunt.fcoo.options,
        common  = grunt.fcoo.common,
        paths   = grunt.fcoo.paths;

    return {
        options: {
            presets  : ["env"],
            sourceMap: true,
            compact  : false
        },

        dist: {
            files: [{
                src : paths.temp_dist_APPLICATIONNAME_TIMPSTAMP_js,
                dest: paths.temp_dist_APPLICATIONNAME_TIMPSTAMP_min_js,
            }]
        }
    }
}