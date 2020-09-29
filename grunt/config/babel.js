/**
 * babel.js - config for grunt-babel
 */

module.exports = function ( grunt ) {

    var options = grunt.fcoo.options,
        common  = grunt.fcoo.common,
        paths   = grunt.fcoo.paths;

    var result = {
            options: {
                presets: ['@babel/preset-env'],
                sourceMap: false,
                compact  : false
            },
            dist: {
                files: {}
            }
        }

    //Not the right way to do it, but it works! :-)
    result.dist.files[paths.temp_dist_APPLICATIONNAME_TIMPSTAMP_js] = paths.temp_dist_APPLICATIONNAME_TIMPSTAMP_js;

    return result;
}