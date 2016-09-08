/**
 * bower.js - config for grunt-bower
 */

module.exports = function ( grunt ) {

    var options = grunt.fcoo.options,
        paths   = grunt.fcoo.paths;   

    
    return {
        //** bower: Copy all main-files from /bower_components to temp/. Only used to get all images and fonts into /temp **
        to_temp: {
            base: paths.bower_components, 
            dest: paths.temp,
            options: {
                checkExistence: options.notDEBUG, //true=all bower components must be pressent. false=allows missing files (only in debug)
                debugging     : options.DEBUG,    
                paths: {
                    bowerDirectory: paths.bower_components, 
                    bowerrc       : '.bowerrc',
                    bowerJson     : 'bower.json'
                }
            }
        }

    }
}

