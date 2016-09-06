/**
 * check.js - Create the check task
 */

module.exports = function (grunt) {

    var options   = grunt.fcoo.options
        taskList = [];


    //'eslint'     = Check the syntax of all .js-files with eslint
    //'sass:check' = Check the syntax of all .scss-files in scr
    if (options.haveJavaScript)
      taskList.push('eslint');

    if (options.haveStyleSheet)
      taskList.push('sass:check');


    return taskList;
}