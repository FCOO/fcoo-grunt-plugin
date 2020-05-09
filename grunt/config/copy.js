/**
 * copy.js - config for grunt-contrib-copy
 */

module.exports = function ( grunt ) {

    var common = grunt.fcoo.common,
        paths  = grunt.fcoo.paths,
        lodash = require('lodash')

        Temp_2_TempDist = { expand: true, cwd: paths.temp, dest: paths.temp_dist };

    return {

        //BowerComponentsData_2_Dev: Copy all files from data/ found in bower_components to dev/ - options.src is set by task "copy_BowerComponentsData_2_Dev" (in grunt\tasks\_build_dev.js)
        BowerComponentsData_2_Dev: { cwd: paths.bower_components, src: [], dest: paths.dev_data, expand: true, flatten: true, filter: 'isFile' },

        //BowerComponentsImages_2_Dev: Copy all files from images/ found in bower_components to dev/ - options.src is set by task "copy_BowerComponentsImages_2_Dev" (in grunt\tasks\_build_dev.js)
        BowerComponentsImages_2_Dev: { cwd: paths.bower_components, src: [], dest: paths.dev_images, expand: true, flatten: true, filter: 'isFile' },

        //BowerComponentsDataFontsImages_2_Temp: Copy all files from images/ and fonts/ found in bower_components to temp/ - options.src is set by task "create__bower_components_js_css_in_temp"
        BowerComponentsDataFontsImages_2_Temp: { cwd: paths.bower_components, src: [], dest: paths.temp, expand: true, filter: 'isFile'},

        //AppStyleDataFontsImages_2_Temp: Copy all files from data/ and fonts/ and images/ found in app/style/ to temp/
        AppStyleDataFontsImages_2_Temp: { cwd: paths.app_styles, src: [paths.data+'*', paths.fonts+'*', paths.images+'*'], dest: paths.temp, expand: true, filter: 'isFile'},

        Temp_data_2_TempDist  : lodash.merge( {}, Temp_2_TempDist,  { flatten: true, src: common.srcExclude_(['**/' + paths.data   + '*.*']), dest: paths.temp_dist_data   } ),
        Temp_fonts_2_TempDist : lodash.merge( {}, Temp_2_TempDist,  { flatten: true, src: common.srcExclude_(['**/' + paths.fonts  + '*.*']), dest: paths.temp_dist_fonts  } ),
        Temp_images_2_TempDist: lodash.merge( {}, Temp_2_TempDist,  { flatten: true, src: common.srcExclude_(['**/' + paths.images + '*.*']), dest: paths.temp_dist_images } ),

        TempDist_2_Dist: { cwd: paths.temp_dist, dest: paths.dist, src: common.srcExclude_(['**/*.*']), expand: true},
        TempDist_2_Dev : { cwd: paths.temp_dist, dest: paths.dev , src: common.srcExclude_(['**/*.*']), expand: true},
        TempDist_2_Demo: { cwd: paths.temp_dist, dest: paths.demo, src: common.srcExclude_(['**/*.*']), expand: true},

        //Copies all files in app/scripts and app/styles to temp, excl. '_*.*' and *.min.js/css
        AppScriptsAppStyles_2_Temp: {
            cwd   : paths.app,
            src   : common.srcExclude_([paths.scripts +'*.js', paths.styles + '*.css', '!**/*.min.*']),
            dest  : paths.temp,
            expand: true,
            filter: 'isFile'
        },

        //Copy app/_index.html.tmpl to dist/index.html
        App_indexHtmlTmpl_2_TempDist_indexHtml: {
            src   : [paths.app + '_index.html.tmpl'],
            dest  : paths.temp_dist + 'index.html'    ,
            expand: false,
            filter: 'isFile'
        },

        //Copy app/_index-dev.html.tmpl to dev/index.html
        App_indexDevHtmlTmpl_2_Dev_indexHtml: {
            src   : [paths.app + '_index-dev.html.tmpl'],
            dest  : paths.dev + 'index.html',
            expand: false,
            filter: 'isFile'
        },

        //Copy favicon_fcoo.svg from node_modules/grunt-fcoo-grunt-plugin/assets/favicon to temp/_favicon/source
        AssetsFaviconSvg_2_Temp_FaviconSource: {
            cwd   : paths.node_modules_fcoo_assets_favicon,
            src   : paths.faviconSvg,
            dest  : paths.temp__favicon_source,
            expand: true
        },

        //Copy  temp/_favicon/result/source/**/favicon.svg to temp_dist/images/favicon.svg.
        TempFaviconResultSourceFaviconSvg_2_TempDist_Images: {
            cwd   : paths.temp__favicon_result,
            src   : '**/' + paths.faviconSvg,
            dest  : paths.temp_dist_images,
            flatten: true,
            isFile: true,
            expand: true
        },

        //Copy  temp/favicon*.* to temp_dist/
        TempFavicon_2_TempDist: {
            cwd   : paths.temp,
            src   : 'favicon*.*',
            dest  : paths.temp_dist,
            flatten: true,
            isFile: true,
            expand: true
        },


        //create_markdown: Copy markdown-files from app/markdown to temp_dist or dev
        AppMarkdown_2_TempDist: {
            cwd   : paths.app_markdown,
            src   : [], //Is set by create_markdown
            dest  : paths.temp_dist,
            expand: true,
            filter: 'isFile'
        },

        //Copy all files in node_modules/grunt-fcoo-grunt-plugin/assets/markdown to each of the markdown-diretries in temp
        AssetsMarkdown_2_Temp: {
            cwd   : paths.node_modules_fcoo_assets_markdown,
            src   : common.srcExclude_('**/*.*'),
            dest  : paths.temp_dist,
            expand: true,
            filter: 'isFile'
        },

        //Copy da.md to en.md for the markdown-directories where there are no en.md
        daMd_2_enMd: {
            cwd   : '',
            src   : [paths.temp_dist + 'ANY_MARKDOWN_DIR/da.md'],
            dest  : paths.temp_dist +  'ANY_MARKDOWN_DIR/en.md',
            expand: false,
            filter: 'isFile'
        },


        //Copies alle files in app to dev, or dist, excl. '_*.*' and 'scripts/**' and 'styles/**'
        App_2_Dev : { cwd: paths.app, dest: paths.dev,  src: common.srcExclude_(['**/*.*', '!**/'+paths.scripts+'**', '!**/'+paths.styles +'**']), expand: true },
        App_2_Dist: { cwd: paths.app, dest: paths.dist, src: common.srcExclude_(['**/*.*', '!**/'+paths.styles +'**', '!**/'+paths.scripts+'**']), expand: true },

        //Copies alle files in dist to temp
        Dist_2_Temp : { cwd: paths.dist, dest: paths.temp,  src: '**/*.*', expand: true },

    }
}