/**
 * postcss.js - config for grunt-postcss
 */

module.exports = function ( grunt ) {

    var paths  = grunt.fcoo.paths;

    return {
        optimize: {
            options: {
                map: false,
                processors: [
                    require('cssnano')({
                        preset: ['default', {
                            discardComments    : false, //Leave comments
                            normalizeWhitespace: false, //Leave NL
                            safe               : true
                        }]
                    })
                ]
            },
            src : paths.temp_dist_APPLICATIONNAME_TIMPSTAMP_css,
            dest: paths.temp_dist_APPLICATIONNAME_TIMPSTAMP_css
        },

        //minimize: Minimize into APPLICATIONNAME_TIMPSTAMP.min.css and create source map file
        minimize: {
            options: {
                map: {
                    inline: false,
                    prev  : false
                },
                processors: [
                    require('cssnano')({
                        preset: ['default', {
                            discardComments: {
                                removeAll: true,
                            }
                        }]
                    })
                ]
            },
            src : paths.temp_dist_APPLICATIONNAME_TIMPSTAMP_css,
            dest: paths.temp_dist_APPLICATIONNAME_TIMPSTAMP_min_css
        },
    }
}