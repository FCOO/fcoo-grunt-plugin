/**
 * DEPLOY
 *
 */

'use strict';

module.exports = function( grunt ){
    function getDeployOptions(){
        return grunt.config('deploy') || {};
    }

    function getSelectedDeploy(){
        var deployList = getDeployOptions().deployList;
        return deployList[ parseInt( grunt.config('deploy_index') ) ];
    }

    function _getAnyPath(pathId){
        var deployOptions = getDeployOptions(),
            deploy = getSelectedDeploy();

        return deployOptions[pathId] + grunt.fcoo.options.application.subpath + (deploy.postfix ? '-'+deploy.postfix : '');
    }


    function getDeployPath(){
        return _getAnyPath('deployPath');
    }

    function getWebPath(){
        return _getAnyPath('webRoot');
    }

    function getWebPathProtected(){
        return _getAnyPath('webRootProtected');
    }



    return {
        getDeployOptions : getDeployOptions,
        getSelectedDeploy: getSelectedDeploy,
        getDeployPath    : getDeployPath,

        getWebPath          : getWebPath,
        getWebPathProtected : getWebPathProtected

    }
};
