/**
 * sed.js - config for grunt-sed
 */

module.exports = function ( grunt ) {

    var options = grunt.fcoo.options,
        common  = grunt.fcoo.common,
        paths   = grunt.fcoo.paths;

    
    return {
        staging: {
            pattern: '\{s\}.fcoo.dk/webmap/\{dataset\}.wms',
            replacement: '{s}.fcoo.dk/webmap-staging/{dataset}.wms',
            recursive: true,
            paths: 'work'
        }
    }
}