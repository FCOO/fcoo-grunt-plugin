/**
 * deploy.js - config for tast/deploy.js including grunt-ssh-deploy
 */

module.exports = function ( grunt ) {

    var paths   = grunt.fcoo.paths,
        common  = grunt.fcoo.common,
        options = grunt.fcoo.options,
        secret  = grunt.fcoo.secretJson,
        deploy  = grunt.fcoo.deploy;


    if (!secret)
        return {};

    var deployList = [
            {postfix: 'devel01',    text: 'devel01',         protected: true},
            {postfix: 'devel02',    text: 'devel02',         protected: true},
            {postfix: 'devel03',    text: 'devel03',         protected: true},
            {postfix: 'alpha',      text: 'alpha',           protected: true,  newLine: true},
            {postfix: 'beta',       text: 'beta',            protected: false, newLine: true},
            {postfix: '',           text: 'PRODUCTION',      protected: false, newLine: true},
            {postfix: 'pwa-beta',   text: 'PWA beta',        protected: false, newLine: true},
            {postfix: 'pwa',        text: 'PWA PRODUCTION',  protected: false               },
            {postfix: 'fiin-beta',  text: 'FIIN beta',       protected: true,  newLine: true},
            {postfix: 'fiin',       text: 'FIIN PRODUCTION', protected: true,  newLine: true},


        ];


    return {
        secret          : secret,

        deployPath      : '/home/' + secret.username + '/applications/',
        webRoot         : '/home/' + secret.username + '/webroot/',
        webRootProtected: '/home/' + secret.username + '/webroot/protected/',


        currentSymlink  : 'current',
        previousSymlink : 'previous',
        releaseRoot     : 'releases',
        releasesToKeep  : 3,

        readyTimeout    : 20000,
        maxBuffer       : 200 * 1048,


        deployList      : deployList
    }
}