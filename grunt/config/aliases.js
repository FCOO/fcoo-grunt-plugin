module.exports = function ( grunt ) {

    var tasks = {};

    //Get all tasks from the task-files in grunt/tasks
    grunt.file.recurse(
        'node_modules/grunt-fcoo-grunt-plugin/grunt/tasks', 
        function (abspath, rootdir, subdir, filename) {
            var taskName = filename.split('.')[0],
                internalTaskName,
                taskList;

            if (taskName.charAt(0) != '_'){    
                taskList = require( process.cwd()+'/'+abspath )( grunt );

                for (var i=0; i<taskList.length; i++ )
                    if (typeof taskList[i] == 'function'){
                        //Convert function-task to internal task
                        internalTaskName = taskName+'_'+i;
                        grunt.registerTask(internalTaskName, taskList[i]);
                        taskList[i] = internalTaskName;
                }
                tasks[taskName] = taskList;
            }
        }
    );


    
    //Add aliases
    tasks['github-cli'] = ['push-cli'];
    tasks['github']     = ['push'];
    tasks['prod']       = ['build'];

    
    return tasks;
};