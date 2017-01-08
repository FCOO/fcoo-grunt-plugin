/**
 * deploy_staging.js - Deploy application to staging server
 */

module.exports = function (grunt) {
    return require(__dirname + '/_deploy.js' )( grunt, 'staging', 'temp_deploy_staging' );
}
