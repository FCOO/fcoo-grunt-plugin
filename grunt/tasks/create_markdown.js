/**
 * create_markdown.js - Create the "create_markdown" task but only for application
 */

module.exports = function (grunt) {
    
    
    var common   = grunt.fcoo.common,
        options  = grunt.fcoo.options,
        paths    = grunt.fcoo.paths,
        _console = grunt.fcoo._console,
        lodash = require('lodash'),
        taskList = [],

        dirList,
        srcList = [],
        fileList = [];

    if (options.isPackage)
        return [];

    //Find all sub-dir of app/markdown that contains a da.md file
    dirList = grunt.file.expand({cwd: paths.app_markdown}, '**/da.md');
    for (var i=0; i<dirList.length; i++ ){
        dirList[i] = dirList[i].replace(/\\/g, "/").split('/')[0];
        srcList.push( dirList[i] + '/**/*.*' );
    }
    

    //Find all *.md files and create list of {cwd, src} in result
    function getFileList(){
        var result = [],
            fileNameList = ['da.md', 'en.md'], 
            cwd, fileName;
        for (var i=0; i<dirList.length; i++ ){
            cwd = paths.temp_dist + dirList[i];
            for (var f in fileNameList){
                fileName = fileNameList[f];
                if ( grunt.file.isFile(cwd + '/' + fileName) )
                    result.push({ cwd: cwd, src: fileName } );
            }
        }
        return result;
    }



    //Update config for 'copy:AppMarkdown_2_TempDist'
    taskList.push( function(){
        var copyOptions = grunt.config('copy');
        copyOptions['AppMarkdown_2_TempDist'].src  = common.srcExclude_(  srcList );
        copyOptions['AppMarkdown_2_TempDist'].dest = paths.temp_dist;
        grunt.config('copy', copyOptions);
    });

    //Copy all markdown-files to TempDist or dev
    taskList.push( 'copy:AppMarkdown_2_TempDist' );


    //Create options for 'copy' to copy all files from node_modules/.../assets/markdown to each of the markdown-directories
    taskList.push( function(){
        var copyOptions         = grunt.config('copy'),
            copyMarkdownOptions = copyOptions['AssetsMarkdown_2_Temp'];

        for (var i=0; i<dirList.length; i++ ){
            //Create options for each directories
            var options = lodash.merge( {}, copyMarkdownOptions, {dest: paths.temp_dist + dirList[i]} );
            copyOptions['markdown_files'+i] = options;
        }

        grunt.config('copy', copyOptions);        
    });
    
    //Add the copy-tasks
    for (var i=0; i<dirList.length; i++ )
        taskList.push( 'copy:markdown_files'+i );

    //Copy da.md to en.md if en.md don't exsists
    //var enMissingList = [];
    taskList.push( function(){
        var fileList = getFileList(),
            list = [],
            cwd, enMissing;
        for (var i=0; i<dirList.length; i++ ){
            cwd = paths.temp_dist + dirList[i];
            enMissing = true;
            for (var j=0; j<fileList.length; j++ )
                if ((fileList[j].cwd == cwd) && (fileList[j].src == 'en.md')){
                    enMissing = false;
                    break;
                }
            if (enMissing){
                //Ajust tast copy:daMd_2_enMd
                var copyOptions = grunt.config('copy');

                //Update options and run task
                copyOptions['daMd_2_enMd'+i] = lodash.merge( {}, 
                                                    copyOptions['daMd_2_enMd'], { 
                                                        src : cwd + '/da.md',
                                                        dest: cwd + '/en.md'
                                                    }
                                                );
                grunt.config('copy', copyOptions);        
                grunt.task.run('copy:daMd_2_enMd'+i);
            }
        }
    });

   
    //Update config for 'markdown'
    taskList.push( function(){
        var markdownOptions = grunt.config('markdown')
            fileList = getFileList();

        for (var i=0; i<fileList.length; i++ ){
            var fileObject = lodash.merge( {}, fileList[i], {dest: fileList[i].cwd, ext: '.html', expand: true } );
            if (fileObject.src == 'da.md')
                markdownOptions.da.files.push( fileObject )
            else
                markdownOptions.en.files.push( fileObject );
        }
        grunt.config('markdown', markdownOptions);
    });

    //Convert all md-files to htlm-files
    taskList.push( 'markdown:da',
                   'markdown:en' );


    //Update options for realFavicon:markdown
    if (dirList.length)
        taskList.push( function(){
            var fileList           = getFileList(),
                realFaviconOptions = grunt.config('realFavicon'),
                markdown           = realFaviconOptions.markdown; 

            //Using favicons in parent-dir
            markdown.options.iconsPath = '..';
            
            markdown.options.html = []; //List of the HTML files where to inject favicon markups
            for (var i=0; i<fileList.length; i++ )
                markdown.options.html.push( fileList[i].cwd + '/' + fileList[i].src.replace(".md", ".html") );

            realFaviconOptions.markdown = markdown;
            grunt.config('realFavicon', realFaviconOptions);
        });

    return taskList;
}