/**
 * copy.js - config for grunt-contrib-copy
 */

module.exports = function (grunt, options) {

    var common = grunt.fcoo.common,
        paths  = grunt.fcoo.paths,
        lodash = require('lodash');

    var Temp_2_TempDist     = { expand: true, cwd: paths.temp, dest: paths.temp_dist }; //temp/**/*.* => temp_dist/**/*.*
    
    //bowerComponentsImagesAndFontsDir = array of path to all possible /images/ and fonts/ directories from bower-components. Ensure that all images and fonts are in temp/
    var bowerComponentsImagesAndFontsDir = [],  //Array of path to possible dir with images and/or fonts not included in the main section of the packages bower.json
        files = require('main-bower-files')(), 
        file, lastFile, i;

    for (i=0; i<files.length; i++ ){
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

    return {

        //BowerComponentsImagesFonts_2_Temp: Copy all files from images/ and fonts/ found in _get_bower_components_images_and_fonts_paths to temp/
        BowerComponentsImagesFonts_2_Temp: { cwd: paths.bower_components, src: bowerComponentsImagesAndFontsDir, dest: paths.temp, expand: true, filter: 'isFile'},

        Temp_images_2_TempDist: lodash.merge( {}, Temp_2_TempDist,  { flatten: true, src: common.srcExclude_(['**/' + paths.images + '*.*']), dest: paths.temp_dist_images } ),
        Temp_fonts_2_TempDist : lodash.merge( {}, Temp_2_TempDist,  { flatten: true, src: common.srcExclude_(['**/' + paths.fonts  + '*.*']), dest: paths.temp_dist_fonts  } ),

        TempDist_2_Dist: { cwd: paths.temp_dist, dest: paths.dist, src: common.srcExclude_(['**/*.*']), expand: true},
        TempDist_2_Dev : { cwd: paths.temp_dist, dest: paths.dev , src: common.srcExclude_(['**/*.*']), expand: true},
        TempDist_2_Demo: { cwd: paths.temp_dist, dest: paths.demo, src: common.srcExclude_(['**/*.*']), expand: true},

        //Copies all files in app/scripts and app/styles to temp, excl. '_*.*' and *.min.js/css
        AppScriptsAppStyles_2_Temp: { 
            cwd   : paths.app,
            src   : common.srcExclude_([paths.scripts +'*.js', paths.styles + '*.css', '!**/*.min.*']), 
            dest  : paths.temp,  
            expand: true, 
            filter: 'isFile'
        },

        //Copy app/_index.html.tmpl to dist/index.html
        App_indexHtmlTmpl_2_TempDist_indexHtml: { 
            src   : [paths.app + '_index.html.tmpl'], 
            dest  : paths.temp_dist + 'index.html'    , 
            expand: false,  
            filter: 'isFile'
        },

        //Copy app/_index-dev.html.tmpl to dev/index.html
        App_indexDevHtmlTmpl_2_Dev_indexHtml: { 
            src   : [paths.app + '_index-dev.html.tmpl'], 
            dest  : paths.dev + 'index.html', 
            expand: false,  
            filter: 'isFile' 
        },

        //Copy favicon_fcoo.svg from node_modules/grunt-fcoo-grunt-plugin/assets to temp/_favicon/source
        AssetsSvg_2_Temp_FaviconSource: { 
            cwd   : process.cwd() + '/node_modules/grunt-fcoo-grunt-plugin/assets/', 
            src   : paths.faviconSvg, 
            dest  : paths.temp__favicon_source, 
            expand: true
        },

        //Copy  temp/_favicon/result/source/**/favicon_fcoo.svg to temp_dist/images/favicon.svg. The extra 'undefined' is due to an bug in grunt-svg-modify
        TempFaviconResultSourceFaviconSvg_2_TempDist_Images: {
            cwd   : paths.temp__favicon_result + 'undefined/',
            //cwd   : paths.temp__favicon_result + paths.source,
            src   : paths.faviconSvg, 
            dest  : paths.temp_dist_images, 
            expand: true
        },

        
        
        //Copies alle files in app to dev, or dist, excl. '_*.*' and 'scripts/*.*' and 'styles/*.*'
        App_2_Dev : { cwd: paths.app, dest: paths.dev,  src: common.srcExclude_(['**/*.*', '!**/'+paths.scripts+'*.*', '!**/'+paths.styles+'*.*']), expand: true },
        App_2_Dist: { cwd: paths.app, dest: paths.dist, src: common.srcExclude_(['**/*.*', '!**/'+paths.scripts+'*.*', '!**/'+paths.styles+'*.*']), expand: true },

    }
}