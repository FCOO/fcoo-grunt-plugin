/**
 * deploy_devel02.js - Deploy application to devel02-version
 */

module.exports = function (grunt) {
    return require(__dirname + '/_deploy.js' )( grunt, 'devel02');
}
