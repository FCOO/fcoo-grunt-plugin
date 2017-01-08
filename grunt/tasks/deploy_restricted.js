/**
 * deploy_restricted.js - Deploy application to restricted server
 */

module.exports = function (grunt) {
    return require(__dirname + '/_deploy.js' )( grunt, 'restricted');
}
