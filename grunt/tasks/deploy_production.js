/**
 * deploy_production.js - Deploy application to production server
 */

module.exports = function (grunt) {
    return require(__dirname + '/_deploy.js' )( grunt, 'production');
}
