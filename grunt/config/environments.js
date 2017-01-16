/**
 * environments.js - config for grunt-ssh-deploy
 */

module.exports = function ( grunt ) {

    var paths   = grunt.fcoo.paths,
        common  = grunt.fcoo.common,
        options = grunt.fcoo.options,
        secret  = grunt.fcoo.secretJson;

    if (!secret)
        return {};      

    return {
        // do not store credentials in the git repo, store them separately and read from a secret file
        options: {
            local_path      : paths.temp, //'work',
            current_symlink : 'current',
        },
        staging: {
            options: {
                host        : secret.staging.host,
                username    : secret.staging.username,
                password    : secret.staging.password,
                port        : secret.staging.port,
                deploy_path : '/home/ptest/ifm-maps-grunt',
                debug       : true,
                releases_to_keep: '3'
            }
        },
        beta: {
            options: {
                host        : secret.beta.host,
                username    : secret.beta.username,
                password    : secret.beta.password,
                port        : secret.beta.port,
                deploy_path : '/home/prod/ifm-maps-beta',
                releases_to_keep: '5'
            }
        },
        production: {
            options: {
                host        : secret.production.host,
                username    : secret.production.username,
                password    : secret.production.password,
                port        : secret.production.port,
                deploy_path : '/home/prod/ifm-maps',
                releases_to_keep: '5'
            }
        },
        restricted: {
            options: {
                host        : secret.restricted.host,
                username    : secret.restricted.username,
                password    : secret.restricted.password,
                port        : secret.restricted.port,
                deploy_path : '/home/prod/ifm-maps-protected',
                releases_to_keep: '5'
            }
        }
    } //end of return {...
}