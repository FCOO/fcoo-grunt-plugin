/**
 * concat.js - config for grunt-contrib-concat
 */

module.exports = function (grunt, options) {

    var paths = grunt.fcoo.paths;
        
        //options for concat
        concat_options_js   = { separator: grunt.util.linefeed + ';' + grunt.util.linefeed },
        concat_options_css  = { separator: grunt.util.linefeed };


    return {
        //Concat all *.js files from temp into temp_dist/_src.js
        Temp_js_2_TempDist_srcJs: { 
            src    : paths.temp + '**/*.js', 
            dest   : paths.temp_dist + paths._src_js, 
            options: concat_options_js  
         }, 

        //Concat all *.css files from temp into temp_dist/_src.css
        Temp_css_2_TempDist_srcCss: { 
            src    : paths.temp + '**/*.css',
            dest   : paths.temp_dist + paths._src_css, 
            options: concat_options_css 
        }, 

        //Combine the _src.js and _bower_components.js => APPLICATIONNAME_TIMPSTAMP.js
        TempDist_js_2_TempDist_appnameJs: { 
            src    : [paths.temp_dist + paths._bower_components_js,  paths.temp_dist + paths._src_js  ], 
            dest   : paths.temp_dist_APPLICATIONNAME_TIMPSTAMP_js,  
            options: concat_options_js 
         },

        //Combine the _src.css and _bower_components.css => APPLICATIONNAME_TIMPSTAMP.css
        TempDist_css_2_TempDist_appnameJs: { 
            src : [paths.temp_dist + paths._bower_components_css, paths.temp_dist + paths._src_css ],
            dest: paths.temp_dist_APPLICATIONNAME_TIMPSTAMP_css, 
            options: concat_options_css 
        },

    }
}