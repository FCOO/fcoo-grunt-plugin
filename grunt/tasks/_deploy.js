/**
 * _deploy.js - Create the different deployment tasks
 */

module.exports = function (grunt, subtask, replaceTask) {

    var options   = grunt.fcoo.options
        taskList = [];

    //Allways clean temp
    taskList.push('clean:Temp');

    //Copy dist => temp
    taskList.push('copy:Dist_2_Temp');

    //Run replace task (if any)
    if (replaceTask)
        taskList.push('replace:' + replaceTask);
    
    //SSH Deployment 
    taskList.push('ssh_deploy:' + subtask );

    //Move files
    taskList.push('curl-dir:' + subtask );

    //Clean temp
    if (options.notDEBUG)
        taskList.push('clean:Temp');

    return taskList;
}

