/**
 * PATHS - Create object with all paths and filenames
 * 
 */

'use strict';

module.exports = function( grunt ){

    var options = grunt.fcoo.options,
        paths   = {};

    /**************************************************************************************
    Directory structure 
    APPLICATION_NAME
	    ├── app
        |   ├── index.html.tmpl                 //Template for buiding the application in \dist
        |   ├── index-dev.html.tmpl             //Tempalte for buiding the application in \dev
        |   ├── data                            //Data-files (e.g. .json)
        |   ├── scripts                         //js files
        |   ├── styles                          //css and scss files
        |   |   ├── fonts                           //Font-files
        |   |   └── images                          //Images for css (background-images: "images/example.png")
        |   └── images                          //Images for the application
        ├── dist                            //The compiled and build distribution files 
        |   └── log                            //log-files
        ├── demo                            //Demo page for packages. Also the page for the "gh-pages" branch in GitHub
        ├── dev                             //Development version of the application
        ├── bower_components                //Installed Bower components
        └── node_modules                    //Installed Node.js moduels
        
        **************************************************************************************/
    paths.app = 'app/';
        paths.data   = 'data/';
        paths.scripts = 'scripts/';
        paths.styles  = 'styles/';

        paths.app_data = paths.app + paths.data;

        paths.app_scripts = paths.app + paths.scripts;
        paths.app_styles  = paths.app + paths.styles;
            paths.fonts  = 'fonts/';
            paths.images = 'images/';
            paths.app_styles_fonts  = paths.app_styles + paths.fonts;
            paths.app_styles_images = paths.app_styles + paths.images;
        paths.app_images = paths.app + paths.images;


    //If it is a Package and directory /src exists => use simple dir-structure where all source-files are in /src
    paths.src = 'src/';

    if (options.isPackage && grunt.file.isDir(paths.src)){
        paths.app = '';
        paths.scripts = paths.src;
        paths.styles  = paths.src;
        paths.app_scripts = paths.src;
        paths.app_styles  = paths.src;
        paths.app_styles_fonts  = paths.app_styles + paths.fonts;
        paths.app_styles_images = paths.app_styles + paths.images;
        paths.app_images = paths.app + paths.images;
    }
 
     
    paths.dist = 'dist/';
        paths.dist_images = paths.dist + paths.images;
        paths.dist_log    = paths.dist + 'log/';

    paths.demo = 'demo/';
    
    paths.dev  = 'dev/';
        paths.dev_data = paths.dev + paths.data;

    paths.bower_components = 'bower_components/';

    paths.temp      = 'temp/';
    paths.temp_dist = 'temp_dist/';
        paths.temp_dist_data   = paths.temp_dist + paths.data;
        paths.temp_dist_fonts  = paths.temp_dist + paths.fonts;
        paths.temp_dist_images = paths.temp_dist + paths.images;
            
    //Temp file names
    paths._src_js  = '_src.js';
    paths._src_css = '_src.css';
    paths._bower_components_js  = '_bower_components.js';
    paths._bower_components_css = '_bower_components.css';


    paths.APPLICATIONNAME_TIMPSTAMP_js      = options.APPLICATIONNAME_TIMPSTAMP + '.js';
    paths.APPLICATIONNAME_TIMPSTAMP_min_js  = options.APPLICATIONNAME_TIMPSTAMP + '.min.js';
    paths.APPLICATIONNAME_TIMPSTAMP_css     = options.APPLICATIONNAME_TIMPSTAMP + '.css';
    paths.APPLICATIONNAME_TIMPSTAMP_min_css = options.APPLICATIONNAME_TIMPSTAMP + '.min.css';
        
    paths.temp_dist_APPLICATIONNAME_TIMPSTAMP_js      = paths.temp_dist + paths.APPLICATIONNAME_TIMPSTAMP_js;
    paths.temp_dist_APPLICATIONNAME_TIMPSTAMP_css     = paths.temp_dist + paths.APPLICATIONNAME_TIMPSTAMP_css;
    paths.temp_dist_APPLICATIONNAME_TIMPSTAMP_min_js  = paths.temp_dist + paths.APPLICATIONNAME_TIMPSTAMP_min_js;
    paths.temp_dist_APPLICATIONNAME_TIMPSTAMP_min_css = paths.temp_dist + paths.APPLICATIONNAME_TIMPSTAMP_min_css;

    //Paths to favicons
    paths.temp__favicon = paths.temp + '_favicon/';
        paths.source = 'source/';
        paths.result = 'result/';
        paths.temp__favicon_source = paths.temp__favicon + paths.source;
        paths.temp__favicon_result = paths.temp__favicon + paths.result;

    paths.faviconSvg = 'favicon.svg';
    paths.faviconPng = 'favicon.png';
    paths.temp_dist_images_faviconSvg = paths.temp_dist_images + paths.faviconSvg;
    paths.temp_dist_images_faviconPng = paths.temp_dist_images + paths.faviconPng;


    //Return the module
    return paths;
};
