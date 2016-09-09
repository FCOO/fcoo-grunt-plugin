/**
 * exec.js - config for grunt-exec
 */

module.exports = function ( grunt ) {

    return {
        bower_update       : 'bower update',
        bower_update_latest: 'bower update -f -F',
        npm_install        : 'npm install'
    }
}