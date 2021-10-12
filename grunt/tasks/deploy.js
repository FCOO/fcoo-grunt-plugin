/**
 * deploy.js - Create the deploy task
 */

module.exports = function (grunt) {

    return require(__dirname + '/_deploy_rollback.js' )( grunt, true );
}