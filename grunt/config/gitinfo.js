/**
 * gitinfo.js - config for grunt-gitinfo
 */

module.exports = function (grunt, options) {

    return {
        commands: {
            'userName' : ['config', '--global', 'user.name'],
            'remoteSHA': ['rev-parse', 'origin/master']
        }
    }
}