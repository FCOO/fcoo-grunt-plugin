/**
 * _github.js - Provides github-tasks/functions used by multi tasks
 */

module.exports = function (grunt) {

    var common   = grunt.fcoo.common,
        options  = grunt.fcoo.options,
        paths    = grunt.fcoo.paths,
        _console = grunt.fcoo._console;


    
    //**************************************************
    //writeGithubActionList: write all selected action
    //**************************************************
    function writeGithubActionList(){
        var newVersion,
            tagMessage;

        _console.writelnYellow('**************************************************');
        _console.writelnYellow('ACTIONS:');

        if (grunt.config('build'))
            _console.writelnYellow('- Build/compile the '+(options.isApplication ? 'application' : 'packages'));

        if (grunt.config('newVersion') != 'none') {
            newVersion = semver.inc(options.currentVersion, grunt.config('newVersion'));
            _console.writelnYellow('- Bump \'version: "'+newVersion+'"\' to bower.json and package.json');
        }

        if (grunt.config('commit') == 'commit')
            _console.writelnYellow('- Commit staged changes to a new snapshot. Message="'+grunt.config('commitMessage')+'"');
        else
            _console.writelnYellow('- Amend/combine staged changes with the previous commit');

        if (grunt.config('newVersion') != 'none'){
            tagMessage = grunt.config('tagMessage');
            _console.writelnYellow('- Create new tag="'+newVersion+(tagMessage ? ': '+tagMessage : '') + '"');
        }

        if (options.haveGhPages)
            _console.writelnYellow('- Merge "master" branch into "gh-pages" branch');
        else
            grunt.config.set('release.options.afterRelease', []); //Remove all git merge commands

        if (grunt.config('newVersion') == 'none')
            _console.writelnYellow('- Push all branches to GitHub');
        else
            _console.writelnYellow('- Push all branches and tags to GitHub');
        _console.writelnYellow('**************************************************');
    };


    //*******************************************************
    //runGithubTasks: Run all the needed github-commands
    //*******************************************************
    function runGithubTasks(){
        function writeHeader(header){
            grunt.log.writeln('');
            _console.writelnYellow('**************************************************');
            _console.writelnYellow(header.toUpperCase());
        }

        if (!grunt.config('continue'))
            return 0;

        //Get new version and commit ang tag messages
        var newVersion    = grunt.config('newVersion') == 'none' ? '' : semver.inc(options.currentVersion, grunt.config('newVersion')),
            commitMessage = grunt.config('commitMessage') || 'No message',
            tagMessage    = grunt.config('tagMessage') || '',
            userName;

        if (newVersion){
            //Create tagMessage
            userName   = grunt.config('gitinfo').userName || grunt.fcoo.bowerJson.authors; //grunt.fcoo.bowerJson.authors is fall-back
            tagMessage = ' -m "Version '  + newVersion + '"'  +
                         ' -m "Released by '+ userName +' (https://github.com/'+userName+') ' +grunt.fcoo.todayStr +'"' +
                         (tagMessage ? ' -m "' + tagMessage + '"' : '');

            //Update grunt.fcoo.bowerJson
            grunt.fcoo.bowerJson.version = newVersion;
        }

        //Build application/packages
        if (grunt.config('build')){
            writeHeader('Build/compile the '+(options.isApplication ? 'application' : 'packages'));
            common.runCmd('grunt build', true);
        }

        //Bump bower.json and packages.json
        if (newVersion){
            writeHeader('Bump \'version: "'+newVersion+'"\' to bower.json and package.json');
            var files = ['bower.json', 'package.json'], file, json;
            for (var i=0; i<files.length; i++ ){
                file = files[i];
                json = grunt.file.readJSON(file);
                json.version = newVersion;
                grunt.file.write(file, JSON.stringify(json, null, '  ') + '\n');
                grunt.log.writeln(file+'-OK');
            }

            //Replace {VERSION] with newVersion in all js in dist
            if (options.isPackage){
                common.runCmd('grunt replace:Dist_js_version');  
            }
            
        }

        //git add all
        common.runCmd('git add -A');

        //commit or amend
        if (grunt.config('commit') == 'commit'){
            //commit
            writeHeader('Commit staged changes to a new snapshot');
            common.runCmd('git commit  -m "' + commitMessage + '"');
        }
        else {
            writeHeader('Combine/amend staged changes with the previous commit');
            common.runCmd('git commit --amend --no-edit');
        }


        //git tag
        if (newVersion){
            writeHeader('Create new tag="'+newVersion+'"');
            common.runCmd('git tag ' + newVersion + tagMessage);
        }

        //git push (and push tag)
        writeHeader('Push all branches '+(newVersion ? 'and tags ' : '')+'to GitHub');

        common.runCmd('git push "origin" HEAD');

        if (newVersion)
            common.runCmd('git push "origin" ' + newVersion);


        //Merge "master" into "gh-pages"
        if (options.haveGhPages){
            writeHeader('Merge "master" branch into "gh-pages" branch');
            common.runCmd('git checkout -B "gh-pages"');
            common.runCmd('git merge master');
            common.runCmd('git checkout master');
            common.runCmd('git push "origin" gh-pages');
        }
    };



    return {
        writeGithubActionList: writeGithubActionList,
        runGithubTasks       : runGithubTasks
    };
}