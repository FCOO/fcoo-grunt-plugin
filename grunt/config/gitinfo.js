/**
 * gitinfo.js - config for grunt-gitinfo
 */

module.exports = function ( grunt ) {

    return {
        commands: {
            'userName' : ['config', '--global', 'user.name'],
            'userEMail': ['config', '--global', 'user.email'],
            'remoteSHA': ['rev-parse', 'origin/master']
        }
    }
}