/**
 * deploy_devel01.js - Deploy application to devel01-version
 */

module.exports = function (grunt) {
    return require(__dirname + '/_deploy.js' )( grunt, 'devel01');
}
