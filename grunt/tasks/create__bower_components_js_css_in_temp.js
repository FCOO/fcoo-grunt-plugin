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

    //Finds all paths to possible /images/ and fonts/ directories from bower-components. Ensure that all images and fonts are in temp/. Used by task 'copy:BowerComponentsImagesFonts_2_Temp'
    taskList.push( function(){
        var bowerComponentsImagesAndFontsDir = [],  
            files = require('main-bower-files')(), 
            file, lastFile;

        for (var i=0; i<files.length; i++ ){
            file = files[i];
            file = file.replace(/\\/g, "/");

            //Remove file-name
            file = file.split('/');
            file.pop();
            file = file.join('/');

            file = file.split( paths.bower_components )[1]; //Make file-path relative

            if (file != lastFile){
                bowerComponentsImagesAndFontsDir.push(
                    file + '/' + paths.images + '*',
                    file + '/' + paths.fonts  + '*'
                );
                lastFile = file;
            }    
        }
        //Update config for 'copy:BowerComponentsImagesFonts_2_Temp'
        var copyOptions = grunt.config('copy');
        copyOptions['BowerComponentsImagesFonts_2_Temp'].src = bowerComponentsImagesAndFontsDir;
        grunt.config('copy', copyOptions);
    });
    
    
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