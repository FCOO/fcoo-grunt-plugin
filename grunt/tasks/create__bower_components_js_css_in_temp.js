/**
 * create__bower_components_js_css_in_temp.js - Build _bower_components.js/css and /images, and /fonts from the bower components in temp/
 */

module.exports = function (grunt) {

    var common   = grunt.fcoo.common,
        options  = grunt.fcoo.options,
        paths    = grunt.fcoo.paths,
        bower    = grunt.fcoo.bower,
        taskList = [];


    //clean /temp
    taskList.push( 'clean:Temp' );


    //Copy all "main" files to /temp
    taskList.push( 'bower' );

    //Finds all paths to possible /images/ and fonts/ directories from bower-components. Ensure that all data and fonts and images are in temp/. Used by task 'copy:BowerComponentsDataFontsImages_2_Temp'
    taskList.push( function(){
        var bowerComponentsDataAndFontsAndImagesDir = [],
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
                bowerComponentsDataAndFontsAndImagesDir.push(
                    file + '/' + paths.data   + '*',
                    file + '/' + paths.fonts  + '*',
                    file + '/' + paths.images + '*'
                );
                lastFile = file;
            }
        }
        //Update config for 'copy:BowerComponentsDataFontsImages_2_Temp'
        var copyOptions = grunt.config('copy');
        copyOptions['BowerComponentsDataFontsImages_2_Temp'].src = bowerComponentsDataAndFontsAndImagesDir;
        grunt.config('copy', copyOptions);
    });


    //Copy all files from data/ and fonts/ and images/ found in bower-components subdir /images and /fonts
    taskList.push( 'copy:BowerComponentsDataFontsImages_2_Temp' );

    //Create _bower_components.js and _bower_components.css in temp
    taskList.push( 'bower_concat:all' );

    //Copy all data-files from temp to temp_dist/data
    taskList.push( 'copy:Temp_data_2_TempDist' );

    //Copy all font-files from temp to temp_dist/fonts
    taskList.push( 'copy:Temp_fonts_2_TempDist' );

    //Copy all image-files from temp to temp_dist/images
    taskList.push( 'copy:Temp_images_2_TempDist' );


    if (options.notDEBUG)
        taskList.push( 'clean:Temp' ); //clean /temp



    return taskList;
}