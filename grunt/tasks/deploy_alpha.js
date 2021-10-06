/**
 * deploy_alpha.js - Deploy application to alpha-version
 */

module.exports = function (grunt) {
    return require(__dirname + '/_deploy.js' )( grunt, 'alpha');
}
