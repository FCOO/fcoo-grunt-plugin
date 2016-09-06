/**
 * create__bower_components_js_css_in_temp.js - Build _bower_components.js/css and /images, and /fonts from the bower components in temp/
 */

module.exports = function (grunt) {

    var common   = grunt.fcoo.common,
        options  = grunt.fcoo.options,
        paths    = grunt.fcoo.paths,
        bower    = grunt.fcoo.bower,
        LogFile  = grunt.fcoo.LogFile,
        taskList = [];


    //clean /temp
    taskList.push( 'clean:Temp' );


    //Copy all "main" files to /temp
    taskList.push( 'bower' );

    //Copy all files from images/ and fonts/ found in bower-components subdir /images and /fonts
    taskList.push( 'copy:BowerComponentsImagesFonts_2_Temp' );

    //Create _bower_components.js and _bower_components.css in temp
    taskList.push( 'bower_concat:all' );

    //Copy all image-files from temp to temp_dist/images
    taskList.push( 'copy:Temp_images_2_TempDist' );

    //Copy all font-files from temp to temp_dist/fonts
    taskList.push( 'copy:Temp_fonts_2_TempDist' );


    if (options.notDEBUG)
        taskList.push( 'clean:Temp' ); //clean /temp

  
    
    return taskList;
}