/**
 * realFavicon.js - config for grunt-real-favicon
 */


module.exports = function (grunt, options) {

    var options = grunt.fcoo.options,
        paths   = grunt.fcoo.paths,
        lodash = require('lodash');

    
    return {
        favicon: {
            src : paths.temp_dist_images_faviconSvg, //Path to your master picture
            dest: paths.temp_dist +'/',              //Path to the directory where to store the icons
            options: {
                iconsPath: '/',
                html     : paths.temp_dist + 'index.html', //List of the HTML files where to inject favicon markups
                design   : {
                    ios: {
                        pictureAspect: 'backgroundAndMargin',
                        backgroundColor: options.application.color,
                        margin: '7%',
                        assets: {
                            ios6AndPriorIcons     : true,
                            ios7AndLaterIcons     : true,
                            precomposedIcons      : true,
                            declareOnlyDefaultIcon: true
                        },
                        appName: options.application.name
                    },
                    desktopBrowser: {},
                    windows: {
                        pictureAspect  : 'noChange',
                        backgroundColor: options.application.color,
                        onConflict     : 'override',
                        assets: {
                            windows80Ie10Tile     : true,
                            windows10Ie11EdgeTiles: {
                                small    : true,
                                medium   : true,
                                big      : true,
                                rectangle: true
                            }
                        },
                        appName: options.application.name
                    },
                    androidChrome: {
                        pictureAspect: 'backgroundAndMargin',
                        margin: '17%',
                        backgroundColor: options.application.color,
                        themeColor     : options.application.color,
                        manifest: {
                            name       : options.application.name,
                            display    : 'standalone',
                            orientation: 'notSet',
                            onConflict : 'override',
                            declared   : true
                        },
                        assets: {
                            legacyIcon        : true,
                            lowResolutionIcons: true
                        }
                    },
                    safariPinnedTab: {
                        pictureAspect: 'silhouette',
                        themeColor   : options.application.color
                    }
                },
                settings: {
                    scalingAlgorithm    : 'Mitchell',
                    errorOnImageTooSmall: false
                },
                versioning: {
                    paramName : 'v',
                    paramValue: grunt.template.today("yyyymmddHHMMss")
                }
            }
        }
    }
}