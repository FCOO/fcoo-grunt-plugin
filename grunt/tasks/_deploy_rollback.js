/**
 * deploy.js - The deploy task
 */

module.exports = function (grunt, isDeployTask) {
    var options  = grunt.fcoo.options,
        _console = grunt.fcoo._console,
        _deploy  = grunt.fcoo.deploy,
        appNameAndVersion = '"' + options.name + '^' + options.currentVersion + '"',
        taskList = [];

    //Create prompt to select the type of deploy or rollback
    taskList.push( function(){
        var prompt = grunt.config('prompt'),
            deployList = grunt.config('deploy').deployList,
            promptOptions = {
                options: {
                    questions: [{
                        config : 'deploy_index',
                        type   : 'list',
                        message: isDeployTask ? 'Select where to deploy ' + appNameAndVersion + ':' : 'Select witch version of "'+options.name+'" to rollback:',
                        choices: []
                    }]
                }
            },
            choices = promptOptions.options.questions[0].choices;

        for (var i=0; i<deployList.length; i++){
            if (deployList[i].newLine)
                choices.push('---');
            choices.push( {value: ''+i, name:  deployList[i].text + ' ('+ (deployList[i].protected ? 'protected access' : 'normal access') + ')'} );
        }

        prompt.deploy = promptOptions;
        grunt.config('prompt', prompt);
    });


    //Ask for deploy
    taskList.push( 'prompt:deploy');

    //Create info task
    if (isDeployTask)
        taskList.push( function(){
            var deployOptions = _deploy.getDeployOptions(),
                deploy = _deploy.getSelectedDeploy();

            _console.writelnYellow('----------------------------------------------------------------------------');
            _console.writelnColor('Deploy ' + appNameAndVersion + ' => ' + '"' + _deploy.getDeployPath() + '"',    'yellow');

            if (_deploy.getSelectedDeploy().protected)
                _console.writelnColor('with PROTECTED access via "' + _deploy.getWebPathProtected() + '"',    'yellow');
            else
                _console.writelnColor('with NORMAL access via "' + _deploy.getWebPath() + '"',    'yellow');
        });
    else
        taskList.push( function(){
            _console.writelnYellow('----------------------------------------------------------------------------');
            _console.writelnColor('Rollback the "' + _deploy.getSelectedDeploy().text + '" version of "' + options.name + '" to its previous release?',    'yellow');
        });


    //Add task to confirm
    taskList.push( 'prompt:continue');


    //Add tast to deploy
    taskList.push( function(){
        if (!grunt.config('continue'))
            return 0;

        grunt.log.writeln('');
        grunt.log.subhead(isDeployTask ? 'DEPLOYING' : 'ROLLBACK');


        process.env.IS_DEPLOY = isDeployTask ? 'DEPLOY' : 'ROLLBACK';

        if (isDeployTask){

            //Allways clean temp
            grunt.task.run('clean:Temp');

            //Copy dist => temp
            grunt.task.run('copy:Dist_2_Temp');

            var deployOptions = _deploy.getDeployOptions(),
                deploy = _deploy.getSelectedDeploy();

            //Replace <meta name="owner" content="..."> with current owner
            options.html_meta_tag_owner = '<meta name="owner" content="' + (deploy.owner || 'fcoo.dk') + '">',
            grunt.task.run('replace:metaTagOwner');
        }

        //SSH Deployment
        grunt.task.run('ssh_deploy');

        //Reset cache - NOT USED FOR NOW
        //taskList.push('curl-dir:' + subtask );
        //grunt.task.run('curl-dir:' + subtask );

        //Deploy: Clean temp
        if (isDeployTask && options.notDEBUG)
            grunt.task.run('clean:Temp');

    });

    return taskList;
}

