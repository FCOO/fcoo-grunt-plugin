/**
 * push.js - Create the "push" task (alias "github") but only for package
 */

module.exports = function (grunt) {
    
    
    var common   = grunt.fcoo.common,
        options  = grunt.fcoo.options,
        paths    = grunt.fcoo.paths,
        LogFile  = grunt.fcoo.LogFile,
        _github  = require(__dirname + '/_github.js' )( grunt ),
        taskList = [];


    if (options.isApplication)
        return [ function(){ grunt.fail.fatal('The tast "push" (and alias "github") is not avaiable for applications'); } ];

    
    //Prompt for "Build (Y/N)" and "Version: (Major,Minor,Patch,None)"
    taskList.push( 'prompt:github_build_version' );

    //Write list of status and actions and prompt "Commit" or "Amend" (if it is an option)
    taskList.push( function(){
        //git add all
        common.runCmd('git add -A');

        var gitinfo = grunt.config('gitinfo').local.branch.current,
            localSHA = gitinfo.SHA,
            remoteSHA = grunt.config('gitinfo').remoteSHA;

        //Show git status
        _console.writelnYellow('**************************************************');
        _console.writelnYellow('GIT STATUS:');
        common.runCmd('git status', true);
        _console.writelnYellow('**************************************************\n\n');

        _console.writelnYellow('**************************************************');
        _console.writelnYellow('LAST REMOTE COMMIT:');
        _console.writelnYellow('SHA:'); grunt.log.writeln(remoteSHA);
        _console.writelnYellow('---------------------------------------------------');
        _console.writelnYellow('LAST LOCAL COMMIT:');
        _console.writelnYellow('SHA:'); grunt.log.writeln(gitinfo.SHA);
        _console.writelnYellow('Time:'); grunt.log.writeln(gitinfo.lastCommitTime);
        _console.writelnYellow('Message:'); grunt.log.writeln(gitinfo.lastCommitMessage);
        _console.writelnYellow('Author:'); grunt.log.writeln(gitinfo.lastCommitAuthor );
        _console.writelnYellow('Number:'); grunt.log.writeln(gitinfo.lastCommitNumber);
        _console.writelnYellow('**************************************************\n');

        _console.writelnYellow('Above is a list of changes to be comitted.');
        if (grunt.config('build'))
          _console.writelnYellow('PLUS files created when building eq. dist/'+options.name+'.min.js');
        if (grunt.config('newVersion') != 'none')
          _console.writelnYellow('PLUS bower.json and package.json');

        if (localSHA == remoteSHA){
            _console.writelnYellow('NOTE: The last local commit has been push to remote => only "new" commit is possible.');
            grunt.config('commit', 'commit');
        }

        if (!grunt.config('commit'))
          grunt.task.run('prompt:github_commit');
    });


    //Prompt for commit and/or tag message
    taskList.push( function(){
        if (grunt.config('commit') == 'commit')
            grunt.task.run('prompt:github_commit_message');

        if (grunt.config('newVersion') != 'none')
            grunt.task.run('prompt:github_tag_message');
    });

   
    //write all selected action
    taskList.push( _github.writeGithubActionList );

    /*grunt.task.run('_github_confirm');
    //**************************************************
    //_github_confirm: write all selected action
    //**************************************************
    grunt.registerTask('_github_confirm', function() {
        grunt.task.run('prompt:continue');
    });
    NEW VERSION = */
    //Write all selected action
    taskList.push( 'prompt:continue' );


    //Run all the needed github-commands
    taskList.push( _github.runGithubTasks );


    return taskList;
}