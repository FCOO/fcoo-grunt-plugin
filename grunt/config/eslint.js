/**
 * eslint.js - config for grunt-eslint
 */

module.exports = function ( grunt ) {

    var options = grunt.fcoo.options,
        common  = grunt.fcoo.common,
        paths   = grunt.fcoo.paths;

    //Options for ESLint
    var esLintOptions = common.readJSONFile('.eslintrc', '');
    if (!esLintOptions){
        grunt.fail.warn('.eslintrc missing');
    }

    //Adjust/add some rules
    esLintOptions.rules['no-console'] = options.DEBUG ? 0 : 2;
    
    return {
        target : common.srcExclude_(paths.app_scripts + '**/*.js'),
        options: { rules: esLintOptions.rules }
    }
}