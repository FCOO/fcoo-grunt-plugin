/**
 * image.js - config for grunt-image
 */

module.exports = function (grunt, options) {
    var paths = grunt.fcoo.paths;

    return {
        optimize: {
            options: {
                pngquant      : true,
                optipng       : true,
                zopflipng     : false,//true,
                jpegRecompress: true,//false,
                jpegoptim     : true,//true,
                mozjpeg       : true,//true,
                gifsicle      : true,//true,
                svgo          : false//true
            },
            files: [{
                expand: true,
                cwd   : paths.temp_dist_images,
                src   : ['**/*.{png,jpg,gif,svg}'],
                dest  : paths.temp_dist_images
            }]
        }

    }
}