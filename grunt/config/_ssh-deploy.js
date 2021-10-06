/**
 * ssh-deploy.js - config for grunt-ssh-deploy
 */

module.exports = function ( grunt ) {

    var paths   = grunt.fcoo.paths,
        common  = grunt.fcoo.common,
        options = grunt.fcoo.options,
        secret  = grunt.fcoo.secretJson;

    if (!secret)
        return {};

    function deployOptions( subpathPostfix ){
        return {
            options     : {
                host        : secret.host,
                username    : secret.username,
                password    : secret.password,
                port        : secret.port,
                releases_to_keep: '5',
                deploy_path : '/home/prod/applications/' + options.application.subpath + (subpathPostfix ? '-'+subpathPostfix : '')
            }
        }
    }

    var result = {
        // do not store credentials in the git repo, store them separately and read from a secret file
        options: {
            local_path      : paths.temp,
            current_symlink : 'current'
        },
        devel01     : deployOptions('devel01'),
        devel02     : deployOptions('devel02'),
        devel03     : deployOptions('devel03'),
        alpha       : deployOptions('alpha'),
        beta        : deployOptions('beta'),
        production  : deployOptions()
    };
    return result;
}



/*************************************
module.exports = function ( grunt ) {

    var paths   = grunt.fcoo.paths,
        common  = grunt.fcoo.common,
        options = grunt.fcoo.options;


    var result = {

        // do not store credentials in the git repo, store them separately and read from a secret file
        secret: grunt.fcoo.secretJson, //grunt.file.readJSON('secret.json'),
        environments: {
            options: {
                local_path: paths.temp, //'work',
                current_symlink: 'current',
            },
            staging: {
                options: {
                    host: '<%= secret.staging.host %>',
                    username: '<%= secret.staging.username %>',
                    password: '<%= secret.staging.password %>',
                    port: '<%= secret.staging.port %>',
                    deploy_path: '/home/ptest/ifm-maps-grunt',
                    debug: true,
                    releases_to_keep: '3'
                }
            },
            beta: {
                options: {
                    host: '<%= secret.beta.host %>',
                    username: '<%= secret.beta.username %>',
                    password: '<%= secret.beta.password %>',
                    port: '<%= secret.beta.port %>',
                    deploy_path: '/home/prod/ifm-maps-beta',
                    releases_to_keep: '5'
                }
            },
            production: {
                options: {
                    host: '<%= secret.production.host %>',
                    username: '<%= secret.production.username %>',
                    password: '<%= secret.production.password %>',
                    port: '<%= secret.production.port %>',
                    deploy_path: '/home/prod/ifm-maps',
                    releases_to_keep: '5'
                }
            },
            restricted: {
                options: {
                    host: '<%= secret.restricted.host %>',
                    username: '<%= secret.restricted.username %>',
                    password: '<%= secret.restricted.password %>',
                    port: '<%= secret.restricted.port %>',
                    deploy_path: '/home/prod/ifm-maps-protected',
                    releases_to_keep: '5'
                }
            }
        }

    } //end of return {...

console.log('>>>>>>>>', result);
    return result;
}
***************************************/