/**
 * curl-dir.js - config for grunt-curl
 */

module.exports = function ( grunt ) {

    var paths   = grunt.fcoo.paths,
        options = grunt.fcoo.options;

    return {
        staging: {
            src: [{
                url: 'http://app.fcoo.dk/ifm-maps-staging/*',
                method: 'BAN'
            }],
            router: function (url) {
                return 'curl_ban.log';
            },
            dest: 'temp'
        },

        beta: {
            src: [{
                url: 'http://app.fcoo.dk/ifm-maps-beta/*',
                method: 'BAN'
            },
            {
                url: 'http://ifm-beta.fcoo.dk/*',
                method: 'BAN'
            }],
            router: function (url) {
                return 'curl_ban.log';
            },
            dest: 'temp'
        },

        production: {
            src: [{
                url: 'http://app.fcoo.dk/ifm-maps/*',
                method: 'BAN'
            },
            {
                url: 'http://ifm.fcoo.dk/*',
                method: 'BAN'
            }],
            router: function (url) {
                return 'curl_ban.log';
            },
            dest: 'temp'
        },

        restricted: {
            src: [{
                url: 'http://app.fcoo.dk/protected/impact-maps/*',
                method: 'BAN'
            }],
            router: function (url) {
                return 'curl_ban.log';
            },
            dest: 'temp'
        }
   
    }
}