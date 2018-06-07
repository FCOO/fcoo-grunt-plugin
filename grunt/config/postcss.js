/**
 * postcss.js - config for grunt-postcss
 */

module.exports = function ( grunt ) {

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
                    //PostCSS plugin that generates pixel fallbacks for rem units.
                    require('pixrem')({
                        rootValue    : 16,           //Default=16     rootValue the root element font size. Can be px, rem, em, %, or unitless pixel value. Pixrem also tries to get the root font-size from CSS (html or :root) and overrides this option. Use html option to disable this behaviour.
                        replace      : false,        //Default=false  replace replaces rules containing rems instead of adding fallbacks.
                        atrules      : false,        //Default=false  atrules generates fallback in at-rules too (media-queries)
                        html         : true,         //Default=true   html overrides root font-size from CSS html {} or :root {}
                        browsers     : browserslist, //               browsers sets browser's range you want to target, based on browserslist
                        unitPrecision: 3             //Default=3      unitPrecision control the significant digits after the decimal point
                    }),
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
                        core           : true,
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
                        ignore        : ['rem'], //Is fixed in postcss:optimize by pixrem
                        onFeatureUsage: caniuse_onFeatureUsage
                    })
                ]
            }, //end of options
            src  : paths.dist + paths.APPLICATIONNAME_TIMPSTAMP_css
        } //end of caniuse

    }
}