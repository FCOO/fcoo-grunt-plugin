/**
 * md.js - Create the tast 'md' Create all markdown-files in app/NAME as dev/NAME/index.html
 */

module.exports = function (grunt) {

    var common   = grunt.fcoo.common,
        options  = grunt.fcoo.options,
        paths    = grunt.fcoo.paths,
        taskList = [];


    taskList.push(

        // Clean temp_dist
        'clean:TempDist',

        // Convert md-files to html-files
        'create_markdown',

        // Replace applications-values
        'replace:dist_temp_ALL_application_options',
        'replace:TempDist_html',

        //Copy all files from temp_dist to dev
        'copy:TempDist_2_Dev',

        // Clean temp_dist
        'clean:TempDist'

    );

    return taskList;
}