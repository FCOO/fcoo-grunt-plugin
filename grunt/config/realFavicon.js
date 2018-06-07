/**
 * realFavicon.js - config for grunt-real-favicon
 * Full documentation af http://realfavicongenerator.net/api/non_interactive_api
 */


module.exports = function ( grunt ) {

    var options = grunt.fcoo.options,
        paths   = grunt.fcoo.paths,
        lodash = require('lodash');

        //********************************************************************************
        //Task "realFavicon:all" creates all "favicon*", "apple-touch*", "android*",... files
        //********************************************************************************
        all =  {
            src : paths.temp_dist_images_faviconSvg, //Path to your master picture
            dest: paths.temp_dist,                   //Path to the directory where to store the icons
            options: {
                iconsPath: '',
                html     : paths.temp_dist + 'index.html', //List of the HTML files where to inject favicon markups
                design   : {
                    ios: {
                        pictureAspect  : 'backgroundAndMargin',
                        backgroundColor: options.application.color,
                        margin: '7%',
                        assets: {
                            ios6AndPriorIcons     : true,
                            ios7AndLaterIcons     : true,
                            precomposedIcons      : true,
                            declareOnlyDefaultIcon: true
                        },
                        appName: options.application.name_da
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
                        appName: options.application.name_da
                    },
                    androidChrome: {
                        pictureAspect: 'backgroundAndMargin',
                        margin: '17%',
                        backgroundColor: options.application.color,
                        themeColor     : options.application.color,
                        manifest: {
                            name       : options.application.name_da,
                            display    : 'standalone',
                            orientation: 'notSet',
                            onConflict : 'override',
                            start_url  : './',
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
                    },
			        coast: {
				        picture_aspect  : "background_and_margin",
				        background_color: options.application.color,
				        margin          : "7%" //original "12%"
			        },
			        open_graph: {
				        picture_aspect  : "background_and_margin",
				        background_color: options.application.color,
				        margin          : "7%", //original "12%"
				        ratio           : "1.91:1"
			        },
			        yandex_browser: {
				        background_color: options.application.color,
				        manifest: {
					        show_title: true,
					        version   : "1.0"
				        }
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
        },

        //********************************************************************************
        //Task "realFavicon:favicon" only creates "favicon*" based on the png-file with colored background
        //********************************************************************************
        favicon = lodash.merge({}, all, {
            src : paths.temp_dist_images_faviconPng, //Path to your master picture
            dest: paths.temp                         //Path to the directory where to store the icons
        });

        //Remove the parts not needed for creating "favicon*.*" files
        favicon.ios = null;
        favicon.androidChrome  = null;
        favicon.safariPinnedTab = null;
        favicon.coast = null;
        favicon.open_graph = null;
        favicon.yandex_browser = null;
        favicon.versioning = null;




    return {
        all     : all,
        markdown: all,
        favicon : favicon
    }
}

