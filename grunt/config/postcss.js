/**
 * postcss.js - config for grunt-postcss
 */

module.exports = function (grunt, options) {

    var common = grunt.fcoo.common,
        paths  = grunt.fcoo.paths,
        lodash = require('lodash');

    //Get browserslist
    var browserslistJSON = common.readJSONFile('.browserslistrc', 
        {
            //Default browserslist
            browserslist: [
            
                'last 1 Chrome versions',         //Google Chrome.

                'last 1 Firefox versions',        //Mozilla Firefox.
                'ie >= 9',                        //Explorer Internet Explorer.
                'last 1 Edge versions',           //Microsoft Edge.
                'last 1 iOS versions',            //iOS Safari.
                'last 1 Opera versions',          //Opera.
                'last 1 Safari versions',         //desktop Safari.
                'last 1 ExplorerMobile versions', //Internet Explorer Mobile.
                //Other

                'last 1 Android versions',        //Android WebView.
                'last 1 BlackBerry versions',     //Blackberry browser.
                'last 1 ChromeAndroid versions',  //Chrome for Android (in Other section, because mostly same as common Chrome).
                'last 1 FirefoxAndroid versions', //Firefox for Android.
                'last 1 OperaMobile versions'     //Opera Mobile.

                //'last 1 OperaMini versions',      //Opera Mini
            ]
        }
    );
    var browserslist = browserslistJSON.browserslist.join(',');

    
    //Variables and function used to create caniuse-log using caniuse.com DB
    grunt.fcoo.caniuseFeatures = [];
    function caniuse_onFeatureUsage ( usageInfo ) { 
        var featureList = grunt.fcoo.caniuseFeatures[usageInfo.feature] || [];
        featureList.push(usageInfo);
        grunt.fcoo.caniuseFeatures[usageInfo.feature] = featureList;
    }

    
    return {
        //optimize: optimize using cssnano but no minimizing
        optimize: {
            options: {
                map: false,
                processors: [
                    require('cssnano')({ 
                        autoprefixer   : { browsers: browserslist },
                        discardComments: false, //Leave comments
                        core           : false, //Leave NL
                        safe           : true,  
                    })
                ]
            },
            src : paths.temp_dist_APPLICATIONNAME_TIMPSTAMP_css,
            dest: paths.temp_dist_APPLICATIONNAME_TIMPSTAMP_css
        },

        //minimize: Minimize into APPLICATIONNAME_TIMPSTAMP.min.css and create source map file
        minimize: {
            options: {
                map: {
                    inline: false,
                    prev  : false
                },
                processors: [
                    require('cssnano')({ 
                        discardComments: { removeAll: true },
                        core           : false, //Leave NL - needed for critical to work pro
                        safe           : true,  
                    })
                ]
            },
            src : paths.temp_dist_APPLICATIONNAME_TIMPSTAMP_css,
            dest: paths.temp_dist_APPLICATIONNAME_TIMPSTAMP_min_css
        },
            
        //caniuse - create a log-file with status from caniuse.com
        caniuse: {
            options: {
                map      : false,
                writeDest: false,
                processors: [
                    require('doiuse')({
                        browsers      : browserslist,
                        onFeatureUsage: caniuse_onFeatureUsage
                    })
                ]
            }, //end of options
            src  : paths.dist + paths.APPLICATIONNAME_TIMPSTAMP_css
        } //end of caniuse

    }
}