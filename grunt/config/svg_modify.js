/**
 * svg_modify.js - config for grunt-svg_modify
 */

module.exports = function (grunt, options) {

    var paths  = grunt.fcoo.paths;

    
    return {
        options: { 
            "previewFile": false 
        },
        "favicon": {
            expand: true,
            cwd : paths.temp__favicon, // <--- Folder with sources and results 
            src : paths.source,        // <--- Subfolders will be processed too 
            dest: paths.result         // <--- All processed folders wiil be placed here 
        }
    }
}

