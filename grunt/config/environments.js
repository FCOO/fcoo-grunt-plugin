/**
 * environments.js - config for grunt-ssh-deploy. Need {options:{..}, TASK: {options: {...}}
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
        options: {
            local_path      : paths.temp,
            current_symlink : 'current',
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