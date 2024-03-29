/**
 * create_favicon.js - creates all the favicons and place a svg-version in dist/images
 */

module.exports = function (grunt) {

    var options  = grunt.fcoo.options,
        common   = grunt.fcoo.common,
        paths    = grunt.fcoo.paths,
        taskList = [];

        //Copy original favicon from node_modules/grunt-fcoo-grunt-plugin/assets/favicon to temp/_favicon/source
        taskList.push( 'copy:AssetsFaviconSvg_2_Temp_FaviconSource' );


        //Create the config.json for svg_modify
        taskList.push( function(){
            common.writeJSONFile(
                paths.temp__favicon_source + 'config.json',
                { "variations": { "favicon":{ /*"width":"384", */"color":options.application.faviconColor  } } }
            );
        });

        //Create new version of favicon.svg with new background-color and icon-color
        taskList.push('svg_modify:favicon');

        //Copy the new icon to temp_dist/images
        taskList.push('copy:TempFaviconResultSourceFaviconSvg_2_TempDist_Images');

        //Run realFavicon:all to create all the favicons
        taskList.push('realFavicon:all');

        /*
        Copy a png-version of the favicon to temp_dist/images.
        A 'ugly' workaround since none of the tested grunt-plugins was able
        to convert the svg-file after svg_modify had changed its color. Aming for 384x384px
        */
        var fileNameList = [
                "android-chrome-384x384.png",
                "android-chrome-256x256.png",
                "android-chrome-512x512.png",
                "android-chrome-192x192.png",
                "apple-touch-icon-180x180.png",
                "apple-touch-icon-152x152.png",
                "apple-touch-icon-144x144.png",
                "android-chrome-144x144.png",
                "apple-touch-icon-120x120.png",
                "apple-touch-icon-114x114.png",
                "android-chrome-96x96.png",
                "apple-touch-icon-76x76.png",
                "android-chrome-72x72.png",
                "apple-touch-icon-72x72.png",
                "apple-touch-icon-60x60.png",
                "apple-touch-icon-57x57.png",
                "android-chrome-48x48.png",
                "android-chrome-36x36.png"
            ];

        taskList.push( function(){
            var fileName;
            for (var i=0; i<fileNameList.length; i++ ){
                fileName = paths.temp_dist + fileNameList[i];
                if (grunt.file.isFile( fileName )){
                    grunt.file.copy( fileName, paths.temp_dist_images_faviconPng );
                    break;
                }
            }
        });

        //Creaste all files "favicons*.*" in temp/ by using the png-version as input
        taskList.push('realFavicon:favicon');

        //Copy "favicon*.*" from temp/ to temp_dist/
        taskList.push('copy:TempFavicon_2_TempDist');

// HER>     }

    return taskList;
}