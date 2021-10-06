/**
 * deploy_beta.js - Deploy application to beta-version
 */

module.exports = function (grunt) {
    return require(__dirname + '/_deploy.js' )( grunt, 'beta');
}
