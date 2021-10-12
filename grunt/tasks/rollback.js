/**
 * rollback.js - Create the roll-back task.
 */

module.exports = function (grunt) {

    return require(__dirname + '/_deploy_rollback.js' )( grunt, false );
}