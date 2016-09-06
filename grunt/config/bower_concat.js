/**
 * bower_concat.js - config for grunt-bower-concat
 */

module.exports = function (grunt, options) {

    var paths   = grunt.fcoo.paths;

    //grunt.fcoo.grunt.fcoo.bower_concat_options = options for the task bower_concat:all. 
    grunt.fcoo.bower_concat_options = {
        dependencies: {},
        exclude     : {},
        mainFiles   : {}
    };
    
    return {
        options: {
            separator : grunt.util.linefeed + ';' + grunt.util.linefeed
        },
        all: {
            dest: {
                'js' : paths.temp_dist + paths._bower_components_js,
                'css': paths.temp_dist + paths._bower_components_css
            },

            dependencies: {}, //Is set by the task "_read_overrides_and_resolutions"
            exclude     : {}, //Is set by the task "_read_overrides_and_resolutions"
            mainFiles   : {}, //Is set by the task "_read_overrides_and_resolutions"

            callback: function(mainFiles /*, component*/) {
                for (var i=0; i<mainFiles.length; i++ ){
                    //Use no-minified version if available
                    var parts = mainFiles[i].split('.'),
                        ext   = parts.pop(),
                        min   = parts.pop(),
                        fName;
                    if (min == 'min'){
                      parts.push(ext);
                        fName = parts.join('.');
                        if (grunt.file.exists(fName))
                            mainFiles[i] = fName;
                    }
                }
                return mainFiles;
            }
        }
    }
}