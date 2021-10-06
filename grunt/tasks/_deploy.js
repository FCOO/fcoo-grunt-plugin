/**
 * _deploy.js - Create the different deployment tasks
 */

module.exports = function (grunt, subtask) {

    var options   = grunt.fcoo.options
        taskList = [];


    //Ask for normal or protected access
//TODO    taskList.push( 'prompt:deploy_default_or_protected');


    taskList.push( function(){
        console.log('application_access=', grunt.config('application_access'));
    });


    //Allways clean temp
    taskList.push('clean:Temp');

    //Copy dist => temp
    taskList.push('copy:Dist_2_Temp');

    //SSH Deployment
    taskList.push('ssh_deploy:' + subtask );

    //Move files - NOT USED FOR NOW
    //taskList.push('curl-dir:' + subtask );

    //Clean temp
    if (options.notDEBUG)
        taskList.push('clean:Temp');

    return taskList;
}

