/**
 * css_purge.js - config for grunt-css-purge 
 */

module.exports = function (grunt, options) {

    var paths   = grunt.fcoo.paths;

    return {
        options: {
            "verbose"              : false,
            "no_duplicate_property": true,
        },
        files: {
            src : paths.temp_dist_APPLICATIONNAME_TIMPSTAMP_css,
            dest: paths.temp_dist_APPLICATIONNAME_TIMPSTAMP_css
        }
  
 
    
    }
}
