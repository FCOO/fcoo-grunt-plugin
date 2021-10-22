/**
 * default.js - Create the default task
 */

module.exports = function (grunt) {

    var _console  = grunt.fcoo._console,
        options   = grunt.fcoo.options,

        taskList = [];

    function tastAvaliable( taskName ) {
        for (var i=0; i<options.avaliableTasks.length; i++ )
            if (options.avaliableTasks[i] == taskName)
                return true;
        return false;
    }

    taskList.push( function(){

        _console.writelnYellow('Run one of the following commands:');
        if (tastAvaliable('check'))
            _console.writelnColor('>grunt check ', 'white', '=> Check the syntax of all .js and .scss files', 'yellow');
        if (tastAvaliable('dev'))
            _console.writelnColor('>grunt dev   ', 'white', '=> Creates a development version', 'yellow');
        if (tastAvaliable('build'))
            _console.writelnColor('>grunt build ', 'white', '=> Creates a production version in /dist - same as >grunt prod', 'yellow');
        if (tastAvaliable('push'))
            _console.writelnColor('>grunt push  ', 'white', '=> Create a new Github release incl. new version and tag - same as >grunt github', 'yellow');
        if (tastAvaliable('push-cli'))
            _console.writelnColor('>grunt push-cli {OPTIONS} ', 'white', '=> Create a new Github release incl. new version and tag - same as >grunt github-cli {OPTIONS}', 'yellow');

        if (options.haveDeplomentTasks){
            grunt.log.writeln('----------------------------------------------------------------------------');
            _console.writelnColor('>grunt deploy   ', 'white', '=> Deploy new version of the application',    'yellow');
            grunt.log.writeln('----------------------------------------------------------------------------');
            _console.writelnColor('>grunt rollback ', 'white', '=> Rollback a version of the application to its pervious release',    'yellow');
        }

    });

    return taskList;
}