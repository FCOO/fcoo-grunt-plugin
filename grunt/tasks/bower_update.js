/**
 * bower_update.js - Updates all bower components
 */

module.exports = function (grunt) {

    var common   = grunt.fcoo.common,
        options  = grunt.fcoo.options,
        paths    = grunt.fcoo.paths,
        bower    = grunt.fcoo.bower,
        lodash   = require('lodash'),
        taskList = [];

    //Save bower.fcoo.bowerJson in 'bower.json'
    function write_bower_json(){
        common.writeJSONFile('bower.json', grunt.fcoo.bowerJson);
    };

    //Save original bower.json in _ORIGINAL_bower.json
    taskList.push ( function(){
        common.writeJSONFile(bower.ORIGINALFileName, grunt.fcoo.bowerJson);
    });

    // All tasks after this point will be run with the force option so that grunt will continue after failures
    taskList.push( 'continue:on' );

    //>bower update - Update dependencies bower components AND force latest version (for now)
    taskList.push(
        'clean:Bower_components',
        'shell:bower_cache_clean',
        'shell:bower_update_latest'
    );

    //Save grunt.fcoo.bowerJson in bower.json to overwrite any updates done by >bower update --force-latest
    taskList.push( write_bower_json );

    //Find overrides and resolutions from all dependencies
    taskList.push( function(){
        //options.overridesList   = [PACKAGENAME] of { overrides: {}, overridesInPackage: string }
        //options.resolutionsList = [PACKAGENAME] of { resolutions: {}, resolutionsInPackage: string }
        var options = {
            overridesList  : [],
            resolutionsList: []
        };

        bower.eachDependencies(
            function( bowerPackageName, bowerJson, options, firstLevel, dotBowerJson){
                var packageName, overrides, resolutions;

                //Find overrides
                overrides = bowerJson.overrides || {};
                for (packageName in overrides){
                    if ( overrides.hasOwnProperty(packageName) ){
                        //Check if the package is already in options.overridesList
                        if (options.overridesList[packageName]){
                            //Write warning if not first level and the overrides are different
                            if (    !options.overridesList[packageName].firstLevel &&
                                    (JSON.stringify(overrides[packageName].main) != JSON.stringify(options.overridesList[packageName].overrides.main))
                                )
                                grunt.fcoo._console.writelnYellow('WARNING - The package "' + packageName + '" has overrides in both "' + bowerPackageName + '" and "' + options.overridesList[packageName].overridesInPackage + '"' );
                        }
                        else
                            options.overridesList[packageName] = {
                                'overrides'         : overrides[packageName],
                                'overridesInPackage': bowerPackageName,
                                'firstLevel'        : firstLevel
                            };
                    }
                }

                //Find resolutions
                resolutions = bowerJson.resolutions || {};
                for (packageName in resolutions){
                    if ( resolutions.hasOwnProperty(packageName) ){
                        //Check if the package is already in options.resolutionsList
                        if (options.resolutionsList[packageName]){
                            if (!options.resolutionsList[packageName].firstLevel)
                                grunt.fcoo._console.writelnYellow('WARNING - The package "' + packageName + '" has resolutions in both "' + bowerPackageName + '" and "' + options.resolutionsList[packageName].resolutionsInPackage + '"' );
                        }
                        else
                            options.resolutionsList[packageName] = {
                                'resolutions'         : resolutions[packageName],
                                'resolutionsInPackage': bowerPackageName,
                                'firstLevel'          : firstLevel
                            };
                    }
                }
            },
            options
        );

        //Convert options.overridesList and options.resolutionsList to new overrides and resolutions for bower.json
        var packageName,
            overrides = {},
            resolutions = {};
        for (packageName in options.overridesList)
            overrides[packageName] = options.overridesList[packageName].overrides;

        for (packageName in options.resolutionsList)
            resolutions[packageName] = options.resolutionsList[packageName].resolutions;

        //Save the new overrides and resolutions in grunt.fcoo.bowerJson
        grunt.fcoo.bowerJson.overrides = overrides;
        grunt.fcoo.bowerJson.resolutions = resolutions;

        //Converts grunt.fcoo.bowerJson.overrides to options for bower-concat
        //Note:
        //The format for overrides.dependencies in bower.json is the same as normal dependencies:
        //dependencies: { "packageName": "version", "packageName2": "version2"}
        //BUT in bower-concat the format is
        //options.dependencies: {"thePackage": "packageName",..} or {"thePackage": ["packageName", "packageName2"],..}
        var bower_concat_options = grunt.config('bower_concat');
        bower_concat_options.all.mainFiles = {};
        bower_concat_options.all.dependencies = {};

        for (packageName in overrides)
            if ( overrides.hasOwnProperty(packageName) ){
                var p_overrides = overrides[packageName];

                //Update options.mainFiles
                if (p_overrides.main)
                    bower_concat_options.all.mainFiles[packageName] = p_overrides.main;

                //Update options.dependencies
                if (p_overrides.dependencies){
                    //Add packageName to bower-concat options (if not already there)
                    bower_concat_options.all.dependencies[packageName] =
                        bower_concat_options.all.dependencies[packageName] || [];

                    for(var packageId in p_overrides.dependencies) {
                        if ( !p_overrides.dependencies.hasOwnProperty(packageId) )
                            continue;
                        //Add packageId if it isn't allready in the list
                        if (bower_concat_options.all.dependencies[packageName].indexOf(packageId) == -1)
                            bower_concat_options.all.dependencies[packageName].push(packageId);
                    }
                }
            }

        grunt.config('bower_concat', bower_concat_options);

        //Update options for wiredep with overrides and resolutions
        var wiredep_options = grunt.config('wiredep');
        wiredep_options.dev.overrides = lodash.merge({}, overrides );
        grunt.config('wiredep', wiredep_options);

    }); //end of grunt.registerTask('_read_overrides_and_resolutions', function(){



    //Save update grunt.fcoo.bowerJson in bower.json
    taskList.push( write_bower_json );

    //>bower update - Update dependencies bower components with new overrides and resolutions
    taskList.push(
        'clean:Bower_components',
        'shell:bower_cache_clean',
        'shell:bower_update'
     );

    //Tasks after this point will be run without the force option so that grunt exits if they fail
    taskList.push( 'continue:off' );

    //Restore original bower.json
    taskList.push( bower.copyORIGINALToBowerJson );

    return taskList;
}