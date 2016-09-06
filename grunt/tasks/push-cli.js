/**
 * push-cli.js - Create the "push-cli" task (alias "github-cli")
 */

module.exports = function (grunt) {

    var common   = grunt.fcoo.common,
        options  = grunt.fcoo.options,
        paths    = grunt.fcoo.paths,
        _github  = require(__dirname + '/_github.js' )( grunt ),
        taskList = [];


    if (options.isApplication)
        return [ function(){ grunt.fail.fatal('The tast "push-cli" (and alias "github-cli") is not avaiable for applications'); } ];

    taskList.push( function(){
        // Get all options
        var nopt = require("nopt"),
            knownOpts = {
                "build" : Boolean,
                "none"  : Boolean,
                "patch" : Boolean,
                "minor" : Boolean,
                "major" : Boolean,
                "amend" : Boolean,
                "commit": [String, null],
                "tag"   : [String, null]
            },
            cliOptions = nopt(knownOpts);

        //build
        grunt.config('build', cliOptions.build );

        //newVersion
        grunt.config('newVersion',
                     cliOptions.none ? 'none' :
                     cliOptions.patch ? 'patch' :
                     cliOptions.minor ? 'minor' :
                     cliOptions.major ? 'major' :
                     'patch'
        );

        //commit = 'commit' or 'amend'
        grunt.config('commit', 'commit');
        grunt.config('commitMessage', options.commit || '');
        if (cliOptions.amend){
            //Check if 'git commit --amend' is allowed
            if (grunt.config('gitinfo').local.branch.current.SHA == grunt.config('gitinfo').remoteSHA)
                //Can't amend because current commit is already push
                grunt.fail.fatal('The last local commit has been push to remote => only "new" commit is possible.');
            else
                grunt.config('commit', 'amend');
        }
        grunt.config('tagMessage', cliOptions.tag || '');
    });


    //write all selected action
    taskList.push( _github.writeGithubActionList );

    //Set 'contunie' = true to prevent any prompt
    taskList.push( function(){ grunt.config('continue', true); });
    
    //Run all the needed github-commands
    taskList.push( _github.runGithubTasks );
    
    
    return taskList;
}