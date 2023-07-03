/**
 * _build_dev.js - Create the "dev" and "build" task (alias "prod")
 */

module.exports = function (grunt, isBuildTasks) {
    var common     = grunt.fcoo.common,
        options    = grunt.fcoo.options,
        paths      = grunt.fcoo.paths,
        _console   = grunt.fcoo._console,
        isDevTasks = !isBuildTasks,
        taskList   = [];


    function _runACmd(cmd){
        if (!cmd)
            return 0;
        var cmdList = cmd.split('&');
        for (var i=0; i<cmdList.length; i++ )
            common.runCmd(cmdList[i].trim());
    }


    //Warning of options.DEBUG = true
    if (options.DEBUG)
        taskList.push( function(){
            _console.writelnYellow('************************************');
            _console.writelnYellow('NOTE: options.DEBUG is set to "true"');
            _console.writelnYellow('************************************');
        });

    //Set options.isBuild
    taskList.push( function(){
        grunt.fcoo.options.isBuild = isBuildTasks;
    });

    //Set process.env
    taskList.push( function(){
        process.env.NODE_ENV = (isBuildTasks ? 'prod' : 'dev');
     });


    //Run "before-commands" (if any)
    taskList.push( function(){
        _runACmd( isBuildTasks ? options.beforeProdCmd : options.beforeDevCmd);
    });

    //ALWAYS clean /temp, and /temp_dist and update bower and check syntax
    taskList.push('clean:Temp', 'clean:TempDist' );

    //Update bower-components
    if (options.isPackage && isBuildTasks && !options.build_bowerFullUpdate)
        taskList.push('shell:bower_update'); //Simple >bower update
    else
        taskList.push('bower_update'); //Full update

    //Check syntax
    if (!options.build_noCheck)
        taskList.push( 'check' );

    //BUILD JS (AND CSS) FROM SRC
    if (isBuildTasks){
        taskList.push('clean:Dist'); //Clear the /dist directory

        if (options.isApplication)
            taskList.push('copy:AppScriptsAppStyles_2_Temp'); //Copy all *.js (ext. '.min.js) from app/scripts to temp and all *.css (ext. '.min.css) from app/styles to temp
        else
            taskList.push('copy:Src_2_Temp');     //Copy all *.js and *.css (ext. '.min.js/css) from src and sub-dir to temp

        if (options.haveJavaScript)
            taskList.push(
                'concat:Temp_js_2_TempDist_srcJs' //Concat all *.js files from temp into temp_dist/_src.js
            );

       if (options.haveStyleSheet)
            taskList.push(
                'sass:build',                          //compile all sass
                'concat:Temp_css_2_TempDist_srcCss',   //Concat all *.css files from temp into temp_dist/_src.css
                'copy:AppStyleDataFontsImages_2_Temp'  //Copy all data/* and fonts/* and images/* from app.styles to temp/
            );

        taskList.push(
            'copy:Temp_data_2_TempDist',  //Copy all data-files from temp to temp_dist/data
            'copy:Temp_fonts_2_TempDist', //Copy all font-files from temp to temp_dist/fonts
            'copy:Temp_images_2_TempDist' //Copy all image-files from temp to temp_dist/images
        );

        if (options.notDEBUG)
            taskList.push( 'clean:Temp' ); //clean /temp

    } //end of if (isBuildTasks){...


    //MODIFY (RENAME AND/OR MOVE) FILES IN DEV OR IN TEMP_DIST BEFORE THEY ARE MOVED TO DIST

    //APPLICATION
    if (options.isApplication){
        if (isBuildTasks){
            //APPLICATION-BUILD
            taskList.push(
                //Optimize all images in temp_dist/images
                'image:optimize',

                //Build _bower_components.js/css and /images, and /fonts from the bower components in temp/
                'create__bower_components_js_css_in_temp',

                //Concat js/css files to APPLICATIONNAME_TIMPSTAMP.js/css in temp_dist
                'concat:TempDist_js_2_TempDist_appnameJs',  //Combine the _src.js and _bower_components.js => APPLICATIONNAME_TIMPSTAMP.js in temp_dist/
                'concat:TempDist_css_2_TempDist_appnameJs', //Combine the _src.css and _bower_components.css => APPLICATIONNAME_TIMPSTAMP.css in temp_dist/

                //Create index.html in temp_dist/
                'copy:App_indexHtmlTmpl_2_TempDist_indexHtml', //Copy _index.html.tmpl from app => temp_dist/index.html

                //Insert meta-data and links to .js and .css in temp_dist/index.html
                'replace:TempDist_html',

                //Replace {APPLICATION_XXX} with current values from application-options gruntfile.js in *.html, *.js and *.css in temp_dist
                'replace:dist_temp_ALL_application_options',

                //Create all favicon etc.
                'create_favicon',

                //Optimize and minimize APPLICATIONNAME_TIMPSTAMP.css -> APPLICATIONNAME_TIMPSTAMP.min.css
//NO WORKING YET                'css_purge',          //Remove unused styles
                'postcss:optimize',   //optimize using cssnano but no minimizing
                'postcss:minimize',   //Minimize into APPLICATIONNAME_TIMPSTAMP.min.css

                //babel: convert ES6 => ES5
                'babel:build',

                //Optimize and minimize APPLICATIONNAME_TIMPSTAMP.js -> APPLICATIONNAME_TIMPSTAMP.min.js
                //'uglify:build', Removed in version 5.4
                'terser:build',     //Added in in version 5.4

                //Replace url( PATH ) with url('data:image/png;base64,... ) in APPLICATIONNAME_TIMPSTAMP.min.css. Both images and fonts
                'cssUrlEmbed:encode',

                //Copies alle files in app\ to dist, excl. '_*.*' and 'scripts' and 'styles'
                'copy:App_2_Dist',

                //Copy all files from temp_dist to dist
                'copy:TempDist_2_Dist',

            );
        } //end of APPLICATION-BUILD

        else {

            /*
            APPLICATION_DEV:
                - Copy app/_index-dev.html.tmpl to \dev and insert meta-data
                - Create links for all js- and css-files in app/scripts and app/styles and in bower-components
                - Copy all files in bower_components/../dist/data to dev/data
            */
            //Copy app/_index-dev.html.tmpl to dev/index.html
            taskList.push( 'copy:App_indexDevHtmlTmpl_2_Dev_indexHtml' );

            //Create string with link and script to all files in app/scripts and app/styles
            taskList.push( function(){
                var i, j;

                function findFiles(dir, ext){
                    //Find all files in src with .ext but excl. .min.ext
                    return grunt.file.expand( common.srcExclude_([dir + '**/*.' + ext, '!' + dir + '**/*.min.' + ext]) );
                }

                //Find all js-files
                _console.writelnYellow('Including all js-files');
                var jsFiles = findFiles(paths.app_scripts, 'js'),
                    jsFile;
                grunt.fcoo.script_js = '';
                for (i=0; i<jsFiles.length; i++ ){
                    jsFile = jsFiles[i];
                    grunt.log.writeln(jsFile);
                    grunt.fcoo.script_js += '  <script src="../' + jsFile + '"></script>\n';
                }

                //Find all css-files
                _console.writelnYellow('Including all css-files');
                grunt.fcoo.link_css = '';

                //To ensure that all furture css-files are included, all scss-files are included as css-file.
                var scssFiles = findFiles(paths.app_styles, 'scss');
                for (i=0; i<scssFiles.length; i++ )
                    scssFiles[i] = scssFiles[i].replace(".scss", ".css");

                var cssFiles = findFiles(paths.app_styles, 'css');

                //concat cssFiles and scssFiles and remove duplicate items
                cssFiles.concat(scssFiles);
                for(i=0; i<cssFiles.length; ++i)
                    for(j=i+1; j<cssFiles.length; ++j)
                        if(cssFiles[i] === cssFiles[j])
                            cssFiles.splice(j--, 1);

                var cssFile;
                for (i=0; i<cssFiles.length; i++ ){
                    cssFile = cssFiles[i];
                    grunt.log.writeln(cssFile);
                    grunt.fcoo.link_css += '  <link  href="../' + cssFile + '" rel="stylesheet">\n';
                }

            });


            taskList.push(

                //Copies alle files in app\ to dev, excl. '_*.*' and 'scripts' and 'styles'
                'copy:App_2_Dev',

                //Copy all files from temp_dist to dev
                'copy:TempDist_2_Dev',

                //Insert meta-data and <script..> and <link...> in dev/index.html
                'replace:Dev_indexHtml',

                //Insert <script> and <link> for bower-components in dev/index.html
                'wiredep:dev'

            );



            //Find and copy alle data\* from bower-components to dev\data
            //= tast "copy_BowerComponentsData_2_Dev"
            taskList.push( function(){
                var bowerComponentsDataDir = [],
                    bowerComponentsImagesDir = [],
                    files = require('main-bower-files')(),
                    path, relativePath, lastDataPath, lastImagesPath;

                for (var i=0; i<files.length; i++ ){
                    path = files[i];
                    path = path.replace(/\\/g, "/");

                    //Remove file-name
                    path = path.split('/');
                    path.pop();
                    path = path.join('/'),
                    relativePath = path.split( paths.bower_components )[1]; //Make file-path relative

                    if ( grunt.file.isDir( path + '/' + paths.data ) && (path != lastDataPath) ){
                        bowerComponentsDataDir.push( relativePath + '/' + paths.data   + '**' );
                        lastDataPath = relativePath;
                    }

                    if (grunt.file.isDir( path + '/' + paths.images ) && (path != lastImagesPath)){
                        bowerComponentsImagesDir.push( relativePath + '/' + paths.images   + '**' );
                        lastImagesPath = relativePath;
                    }
                }

                //Update config for 'copy:BowerComponentsData_2_Dev' and 'copy:BowerComponentsImages_2_Dev'
                var copyOptions = grunt.config('copy');
                copyOptions['BowerComponentsData_2_Dev'].src = bowerComponentsDataDir;
                copyOptions['BowerComponentsImages_2_Dev'].src = bowerComponentsImagesDir;

                grunt.config('copy', copyOptions);
            });

            taskList.push('copy:BowerComponentsData_2_Dev');
            taskList.push('copy:BowerComponentsImages_2_Dev');

        } //end of APPLICATION-DEV

    } //end of if (options.isApplication){

    //PACKAGE
    if (options.isPackage){

        if (isBuildTasks){
            //PACKAGE-BUILD

            //Rename all src.* to "name".*
            if (options.haveJavaScript)
                taskList.push('rename:TempDist_srcJs_2_nameJs');
            if (options.haveStyleSheet)
                taskList.push('rename:TempDist_srcCss_2_nameCss');

            //Copy all files from temp_dist to dist
            taskList.push( 'copy:TempDist_2_Dist' );
        }

        else {

            //PACKAGE_DEV
            taskList.push(

                //Build _bower_components.js/css and /images, and /fonts from the bower components in temp/
                'create__bower_components_js_css_in_temp',

                //Rename _bower_components.* -> bower_components.*
                'rename:TempDist__bower_components_2_TempDist_bower_components',

                //Copy all files from temp_dist to demo
                'copy:TempDist_2_Demo'
            );
        }


    } //end of if (options.isPackage){


    if (options.notDEBUG)
        taskList.push(
            'clean:Temp',
            'clean:TempDist'
       );

    //Run "after-commands" (if any)
    taskList.push( function(){
        _runACmd( isBuildTasks ? options.afterProdCmd : options.afterDevCmd );
    });

    var newTaskList = [];
    for (var i= 0; i<taskList.length; i++){
        var txt = '**** Task #'+i;
        if (typeof taskList[i] == 'string')
            txt = txt + ': ' + taskList[i];
            txt = txt + ' ****';
        var f = new Function('console.log("' + txt + '");');
        newTaskList.push( f );
        newTaskList.push( taskList[i] );
    }


    return newTaskList;
}