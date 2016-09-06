/**
 * create_logfiles.js - Create all log-files for task build
 */

module.exports = function (grunt) {

    var common   = grunt.fcoo.common,
        options  = grunt.fcoo.options,
        paths    = grunt.fcoo.paths,
        LogFile  = grunt.fcoo.LogFile,
        bower    = grunt.fcoo.bower,
        taskList = [];
        

   

    //********************************************************************************
    //1: Check APPLICATIONNAME_TIMPSTAMP.css against the caniuse.com DB, and...
    //********************************************************************************
    taskList.push( 'postcss:caniuse' );

        
    //********************************************************************************
    //2: write the result to dist/log/caniuse.md and log/caniuse.txt
    //********************************************************************************
    taskList.push( function(){
        var logFile = new LogFile();;

        logFile
            .write('Check of Stylesheet using caniuse.com', '#')
            .write('File: `' + paths.dist + paths.APPLICATIONNAME_TIMPSTAMP_css + '`', '####' )
            .write('Time: `' + grunt.fcoo.todayStr + '`', '####' );

        var issues = 0;
        for (var featureId in grunt.fcoo.caniuseFeatures)
            issues += grunt.fcoo.caniuseFeatures[featureId].length;
        logFile.write('Issues: `' + issues + '`', '####' );

        for (var featureId in grunt.fcoo.caniuseFeatures){
            var featureList = grunt.fcoo.caniuseFeatures[featureId],
                feature = featureList[0],
                featureData = feature.featureData,
                caniuseData = featureData.caniuseData;

            logFile
                .write('', '----------', true)
                .write(caniuseData.title+' (`'+featureId+'`)', '###')
                .write('Description','####')
                .write(caniuseData.description )
                .write(caniuseData.spec );

            if (featureData.missing)
                logFile
                    .write('Not supported by','####')
                    .write(featureData.missing );

            if (featureData.partial)
                logFile
                    .write('Partial supported by','####')
                    .write(featureData.partial );

            if (caniuseData.notes || caniuseData.notes_by_num){
                logFile.write('Notes','####');
                if (caniuseData.notes)
                    logFile.write(caniuseData.notes, '-');
                if (caniuseData.notes_by_num)
                    for (var note in caniuseData.notes_by_num)
                        logFile.write(caniuseData.notes_by_num[note], '-');
                logFile.write('');
            }

            logFile.write('Line / Column','####');
            for (var i=0; i<featureList.length; i++ ){
                feature = featureList[i];
                featureData = feature.featureData;
                logFile.write('`'+feature.usage.source.start.line+' / '+feature.usage.source.start.column+'`', '-');
            }
            
        }

        logFile.writeTxtFile( paths.dist_log + 'caniuse.txt' );
        logFile.writeMdFile( paths.dist_log + 'caniuse.md' );
    });

    
    //********************************************************************************
    //3: Run "bower list" and save output in dist/log/bower_list.txt
    //********************************************************************************
    taskList.push( function(){ 
        common.runCmd('bower list >'+paths.dist_log+'bower_list.txt', true) 
    });
        
    //********************************************************************************
    //4:Create list of all packages used by the application in dist/log/packages.md and dist/log/packages.txt
    //********************************************************************************
    function _addPackage( pname, bowerJson, options, firstLevel, dotBowerJson ){
        if (!firstLevel)
            options.list.push({
                name    : bowerJson.name     || dotBowerJson.name     || pname,
                homepage: bowerJson.homepage || dotBowerJson.homepage || '',
                version : bowerJson.version  || dotBowerJson.version  || ''
            });
    };

    taskList.push( function(){
        var options = {list:[]};
        bower.eachDependencies( _addPackage, options);

        options.list.sort(function(a, b){
            var aName = a.name.toLowerCase(),
                bName = b.name.toLowerCase();
            if (aName < bName) return -1;
            if (aName > bName) return 1;
            return 0;
        });

        var logFile = new LogFile();
        logFile
            .write('Packages used by application', '#')
            .write('Application: `' + grunt.fcoo.bowerJson.name  + '`', '####' )
            .write('Title: `' + options.title  + '`', '####' )
            .write('Version: `' + grunt.fcoo.bowerJson.version + '`', '####' )
            .write('Time: ' + grunt.fcoo.todayStr, '####' )
            .writeTxt('*** Packages ***')
            .writeMd('## Packages');


        for (var i=0; i<options.list.length; i++ ){
            logFile
                .writeMd('#### ['+options.list[i].name+']('+options.list[i].homepage+') - Version ' + options.list[i].version )
                .writeTxt(options.list[i].name + ':' )
                .writeTxt('    Version : '+options.list[i].version )
                .writeTxt('    Homepage: ' + options.list[i].homepage )
                .writeTxt('');
        }
        logFile
            .writeTxt('*** Debugging ***')
            .writeMd('## Debugging')
            .write('To debug this exact version you need to:')
            .write('Clone the application from Github', '1.', true)
            .write('Copy the file dist/log/bower_debug.json to /bower.json' , '2.')
            .write('Build the application using `>grunt dev`', '3.')
            
            .writeTxtFile( paths.dist_log + 'packages.txt' )
            .writeMdFile( paths.dist_log + 'packages.md' );

        //Create bower_debug.json = a copy of bower.json with "dependencies" and "resolutions" set excatly as the current version
        grunt.fcoo.bowerDebugJson.dependencies = {};
        grunt.fcoo.bowerDebugJson.resolutions = {};

        for (var i=0; i<options.list.length; i++ ){
            var id = options.list[i].name, version = options.list[i].version;
            grunt.fcoo.bowerDebugJson.dependencies[id] = version;
            grunt.fcoo.bowerDebugJson.resolutions[id] = version;
        }

        //Write debug-version of bower.json to dist/log/bower_debug.json
        common.writeJSONFile( paths.dist_log + 'bower_debug.json', grunt.fcoo.bowerDebugJson );
    
    });


    //5:Write debug-version of bower.json to dist/log/bower_debug.json
//        'write_bower_debug.json'







    return taskList;
}