/**
 * bowerInstall.js - config for grunt-bowerInstall
 */

module.exports = function ( grunt ) {
 
    return {
        dev: {
            src: grunt.fcoo.paths.dev + 'index.html'
            // Optional: cwd: '', dependencies: true, devDependencies: false, exclude: [], fileTypes: {}, ignorePath: '', overrides: {}
        }
    }
}