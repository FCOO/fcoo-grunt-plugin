/**
 * shell.js - config for grunt-shell
 */

module.exports = function ( grunt ) {
    var options = grunt.fcoo.options;

    return {
        options: {
            stdout      : false,          //Default: true. Show stdout in the terminal.
            stderr      : options.DEBUG,  //Default: true. Show stderr in the terminal.
            stdin       : true,           //Default: true. Forward the terminal's stdin to the command.
            failOnError : true            //Default: true. Fail task if it encounters an error. Doesn't apply if you specify a callback.
        },
        bower_update        : { command: 'bower update'      },
        bower_update_latest : { command: 'bower update -F'   },
        bower_cache_clean   : { command: 'bower cache clean' }

    }
}