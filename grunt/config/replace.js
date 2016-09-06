/**
 * replace.js - config for grunt-text-replace
 * If replacement[..].to is a variable that is changed by another tast a function is used to get the current value
 */

module.exports = function (grunt, options) {

    var paths   = grunt.fcoo.paths,
        common  = grunt.fcoo.common,
        options = grunt.fcoo.options;

    function getBowerJsonVersion(){
        return grunt.fcoo.bowerJson.version;
    }
    return {
        TempDist_html: {
            src: paths.temp_dist + 'index.html', overwrite: true,
            replacements: [
                { from: '{APPLICATION_NAME}', to: grunt.fcoo.bowerJson.name               },
                { from: '{BUILD}',            to: grunt.fcoo.todayStr                     },
                { from: '{VERSION}',          to: getBowerJsonVersion                     },
                { from: '{TITLE}',            to: options.title                           },
                { from: '{CSS_FILE_NAME}',    to: paths.APPLICATIONNAME_TIMPSTAMP_min_css },
                { from: '{JS_FILE_NAME}',     to: paths.APPLICATIONNAME_TIMPSTAMP_min_js  }
            ]
        },

        Dev_indexHtml: {
            src: paths.dev + 'index.html', overwrite: true,
            replacements: [
                {from: '{APPLICATION_NAME}', to: grunt.fcoo.bowerJson.name                },
                {from: '{TITLE}',            to: options.title                            },
                {from: '{LINK_CSS}',         to: function(){return grunt.fcoo.link_css;}  },
                {from: '{SCRIPT_JS}',        to: function(){return grunt.fcoo.script_js;} } 
            ]
        },

        Dist_html_version: { 
            src: [paths.dist + '*.html'], overwrite: true, 
            replacements: [
                { from: '{VERSION}', to: getBowerJsonVersion }
            ]  
        },

        Dist_js_version  : { 
            src: [paths.dist + '*.js'], overwrite: true, 
            replacements: [
                { from: '{VERSION}', to: getBowerJsonVersion }
            ]
        },

        dist_temp_ALL_application_options: {
            src         : common.srcExclude_([paths.temp_dist+'*.html', paths.temp_dist+'*.js', paths.temp_dist+'*.css']), overwrite: true,
            replacements: options.applicationOptionsReplacements
//                function(){ return options.applicationOptionsReplacements; }
        
        }
    }
}
