/**
 * BOWER - Functions to edit and retrieve data from bower-components
 * 
 */

'use strict';

module.exports = function( grunt ){
    
    var paths  = grunt.fcoo.paths,
        common = grunt.fcoo.common;

    var ORIGINALFileName = '_ORIGINAL_bower.json'; //File name for saving original vesion of bower.json

    /**
     * copyORIGINALToBowerJson: copy _ORIGINAL_bower.json -> bower.json
     */
    function copyORIGINALToBowerJson(){
        if (grunt.file.exists(ORIGINALFileName)){
            grunt.file.copy(ORIGINALFileName, 'bower.json');
          grunt.file.delete(ORIGINALFileName);
        }
    }


    /**
     * eachDependencies( packageFunc, options )
     * Visit each dependencies and dependencies of dependencies and ... in bower.json
     * packageFunc: function( packageName, bwr, options, firstlevel, dotBowerJson ) - function to process bower.json
     *    bwr         : json-object (= the contents of the current bower.json)
     *    firstlevel  : boolean - true when bwr is the packages own bower.json
     *    dotBowerJson: json-object (= the contents of the current .bower.json)        
     * options: user-defined. Passed on to packageFunc
     */
    function eachDependencies( packageFunc, options ){
        var bwr = common.readJSONFile('bower.json');
        _eachDependencies( bwr.name, bwr, packageFunc, options, [], true, common.readJSONFile('.bower.json') );
    }
    
    /**    
     * _eachDependencies( bwr, packageFunc, options, packageList, firstLevel )
     * Internal version with additional parametre
     * packageList = [PACKAGENAME] of boolean
     */
    function _eachDependencies( packageName, bowerJson, packageFunc, options, packageList, firstLevel, dotBowerJson ){
        var dependenciesPackageName,
            dependencies = bowerJson.dependencies || dotBowerJson.dependencies || {};

        packageFunc(packageName, bowerJson, options, firstLevel, dotBowerJson);

        //Find dependencies
        for (dependenciesPackageName in dependencies)
            if ( dependencies.hasOwnProperty(dependenciesPackageName) ){
                //If the package already has been check => continue
                if (packageList[ dependenciesPackageName ])
                  continue;
                packageList[ dependenciesPackageName ] = true;

                //Read the dependences of the package
                _eachDependencies(
                    dependenciesPackageName,
                    common.readJSONFile(paths.bower_components + dependenciesPackageName + '/bower.json'),
                    packageFunc,
                    options,
                    packageList,
                    false,
                    common.readJSONFile(paths.bower_components + dependenciesPackageName + '/.bower.json')
                );
        }
    }


    //Return the module
    return {
        ORIGINALFileName        : ORIGINALFileName,
        copyORIGINALToBowerJson : copyORIGINALToBowerJson,
        eachDependencies        : eachDependencies
    };
};
