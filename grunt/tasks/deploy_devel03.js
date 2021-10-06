/**
 * deploy_devel03.js - Deploy application to devel03-version
 */

module.exports = function (grunt) {
    return require(__dirname + '/_deploy.js' )( grunt, 'devel03');
}
