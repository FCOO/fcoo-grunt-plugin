/**
 * clean.js - config for grunt-contrib-clean
 */

module.exports = function (grunt, options) {

    var paths = grunt.fcoo.paths;

    return {
        Temp          : [paths.temp],
        TempDist      : [paths.temp_dist],
        Dist          : [paths.dist],
        TempDisk_jscss: [paths.temp_dist + '*.js', paths.temp_dist + '*.css']
    }
}