/**
 * COMMON
 * 
 */

'use strict';

module.exports = function( grunt ){

    var stripJsonComments = require('strip-json-comments');

    
    /**
     * readFile(filename, isJSON, stripComments, defaultContents)     
     */
    function readFile(filename, isJSON, stripComments, defaultContents){
        if (grunt.file.exists(filename)){
            var contents = grunt.file.read(filename) ; 
                if (isJSON || stripComments)
                    contents = stripJsonComments(contents);
                return isJSON ? JSON.parse( contents ) : contents;
        }
        else
           return defaultContents;
    }    
    

    /** 
     * readJSONFile(filename, defaultContents)
     */
    function readJSONFile(filename, defaultContents){ 
        return readFile(filename, true, true, defaultContents === null ? {} : defaultContents);
    }


    /** 
     * writeJSONFile(fileName, contents)
     */
    function writeJSONFile(fileName, contents){
        var obj = JSON.parse(JSON.stringify( contents ));
		grunt.file.write(fileName, JSON.stringify(obj, null, 4));
    }


    /**
     * writeFile(fileName, isJSON, contents )
     */
    function writeFile(fileName, isJSON, contents ){
        if (isJSON)
            contents = JSON.stringify(contents);
        grunt.file.write(fileName, contents);
    }
    
    
    /**
     * updateOptions: Update options with missing id/values from defaultOptions
    */
    function updateOptions( options, defaultOptions){
        for (var id in defaultOptions)
            if ( defaultOptions.hasOwnProperty(id) && 
                 ( !options.hasOwnProperty(id) ) ||
                 ( options[id] === '') ||                  
                 ( options[id] === null)                   
                )
                options[id] = defaultOptions[id];
    }

    /**
     * merge: Merge all the options given into a new object
     */
    function merge(){
        var result = {};
        for(var i=0; i<arguments.length; i++)
            for(var key in arguments[i])
                if(arguments[i].hasOwnProperty(key))
                    result[key] = arguments[i][key];
        return result;
    }

    

    /**
     * srcExclude_(mask)
     */
    function srcExclude_(mask){
        mask = typeof mask === 'string' ? [mask] : mask;
        mask.push('!**/_*/**', '!**/_*.*');
        return mask;
    }


    /**
     * runCmd(cmd, useCmdOutput)
     *   useCmdOutput = true => the command output direct to std
     */
    function runCmd(cmd, useCmdOutput){
        if (!useCmdOutput)
            grunt.log.writeln(cmd['grey']);

        var shell = require('shelljs'),
            result = shell.exec(cmd, {silent:!useCmdOutput});


        if (result.code === 0){
            if (!useCmdOutput)
                grunt.log.writeln(result.output['white']);
        }
        else {
            if (!useCmdOutput){
                grunt.log.writeln();
                grunt.log.writeln(result.output['yellow']);
            }
            grunt.fail.warn('"'+cmd+'" failed.');
        }
        return result;
    }

    



    
    //Return the module
    return {
        readJSONFile : readJSONFile,
        writeJSONFile: writeJSONFile,
        writeFile    : writeFile,

        updateOptions: updateOptions,
        merge        : merge,
         
        srcExclude_  : srcExclude_,
        runCmd       : runCmd

    };
};
