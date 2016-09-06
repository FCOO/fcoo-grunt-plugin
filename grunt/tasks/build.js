/**
 * build.js - Create the task build. 
 */

module.exports = function (grunt) {

    return require(__dirname + '/_build_dev.js' )( grunt, true );
}