/*
 * grunt-fcoo-grunt-plugin
 * https://github.com/FCOO/fcoo-grunt-plugin
 *
 * Copyright (c) 2016 Niels Holt
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

    //Create fcoo-namespace to share data between tasks
    grunt.fcoo = {};

    var path = require('path');

    //Load modules from ../lib
    var _console  = grunt.fcoo._console  = require('../lib/console')( grunt ),
        common    = grunt.fcoo.common    = require('../lib/common' )( grunt ),
        options   = grunt.fcoo.options   = require('../lib/options')( grunt ),
        paths     = grunt.fcoo.paths     = require('../lib/paths'  )( grunt ),
        LogFile   = grunt.fcoo.LogFile   = require('../lib/LogFile')( grunt ),
        bower     = grunt.fcoo.bower     = require('../lib/bower'  )( grunt );

    
    //Defile common/"global" variables and objects
    grunt.fcoo.todayStr  = grunt.template.today("dd-mmm-yyyy HH:MM");

    grunt.fcoo.bowerJson      = common.readJSONFile('bower.json');
    grunt.fcoo.bowerDebugJson = common.readJSONFile('bower.json');
        
    grunt.fcoo.script_js  = ''; //string with <script>..</script> for all *.js in app/scripts
    grunt.fcoo.link_css   = ''; //string with <link>..</link> for all *.css in app/styles

    //Capture the log.header function to remove the 'Running tast SOMETHING" message
    grunt.log.header = function(txt){
        if (options.DEBUG){
            grunt.log.writeln('>'+txt);          
        }        
    };

    /**************************************************************************************
    Load grunt config files
    The configObject used by grunt.config.init(configObject) is breaked up into a js-file pro packages
    These config-files are named after the packages and placed in grunt/config where load-grunt-config
    will read them.
    The js-file grunt/config/aliases.js is not a config-file but is used by load-grunt-config to
    define the different tasks.
    grunt/config/aliases.js will read all the tasks files in grunt/tasks and create tasks with the
    same name as the files. 
    Each task-file will return a array of string = name of tasks or functions to be called.
    A mix of task-names (string) and task-functions is allowed since aliases.js will convert
    any functions to internal tasks

    Naming the tasks and filters using:
    directory-name: Uppercase CamelCase eg. app/scripts = 'AppScripts'
    file-name     : lowercase camelCase eg. index.html = 'indexHtml'
    extentions    : lowercase eq. all *.css-files = 'css'
    direction     : '2'
    Eq.: Move all *.js files in /app/scripts to /temp = "AppScript_js_2_Temp"
    **************************************************************************************/

    require('load-grunt-config')(grunt, {
        configPath    : path.join(process.cwd(), 'node_modules/grunt-fcoo-grunt-plugin/grunt/config'),
        init          : true,
        loadGruntTasks: false
    }); 

    /**************************************************************************************
    Load grunt-packages
    **************************************************************************************/
    var pluginDependencies = common.readJSONFile('node_modules/grunt-fcoo-grunt-plugin/package.json').dependencies,
        packageName,
        dirName;

    for (packageName in pluginDependencies)
        if ( pluginDependencies.hasOwnProperty(packageName) ){
            dirName = process.cwd() + '/node_modules/'+packageName+'/tasks';
            if ( grunt.file.isDir(dirName) )
              grunt.loadTasks(dirName);
        }

    //Run the gitinfo-task to get username
    grunt.task.run('gitinfo');

    //Check if _ORIGINAL_bower.json exists => probably an error in last run => copy it back;
    bower.copyORIGINALToBowerJson();

};


