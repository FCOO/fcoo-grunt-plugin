/**
 * curl-dir.js - config for grunt-curl
 */

module.exports = function (grunt, options) {

    var paths   = grunt.fcoo.paths,
        options = grunt.fcoo.options;

    return {
        favicon: {
            src : options.application.faviconFileName, 
            dest: paths.temp_dist_images_faviconSvg
        }
    }
}