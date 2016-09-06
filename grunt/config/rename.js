/**
 * rename.js - config for grunt-contrib-rename
 */

module.exports = function (grunt, options) {

    var options = grunt.fcoo.options,
        paths   = grunt.fcoo.paths;

    
    return {
        TempDist_srcJs_2_nameJs: { files: [ {
            src : paths.temp_dist + paths._src_js, 
            dest: paths.temp_dist + options.name + '.js'
        } ] },

        TempDist_srcCss_2_nameCss: { files: [ { 
            src : paths.temp_dist + paths._src_css, 
            dest: paths.temp_dist + options.name + '.css'
        } ] },

        //Remove '_' from filenames in temp_dist/
        TempDist__bower_components_2_TempDist_bower_components: { files: [ 
            { src : paths.temp_dist + '_bower_components.js',  dest: paths.temp_dist + 'bower_components.js'}, 
            { src : paths.temp_dist + '_bower_components.css', dest: paths.temp_dist + 'bower_components.css'} 
        ] }



    }
}