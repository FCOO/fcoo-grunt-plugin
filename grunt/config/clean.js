/**
 * clean.js - config for grunt-contrib-clean
 */

module.exports = function ( grunt ) {

    var paths = grunt.fcoo.paths;

    return {
        Bower_components: [paths.bower_components],
        Temp            : [paths.temp],
        TempDist        : [paths.temp_dist],
        Dist            : [paths.dist],
        TempDisk_jscss  : [paths.temp_dist + '*.js', paths.temp_dist + '*.css']
    }
}