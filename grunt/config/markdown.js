/**
 * markdown.js - config for grunt-markdown
 */

module.exports = function ( grunt ) {

    var common = grunt.fcoo.common,
        paths  = grunt.fcoo.paths,
        lodash = require('lodash');

    var marked   = require('marked'),
        renderer = new marked.Renderer();

    renderer.table = function(header, body){
        //console.log(header);
    }
     
    //tagClassList = [] of {tag,class} = list of class-names for tags
    var tagClassList = [
        {tag: 'table', class: 'table table-striped table-hover table-bordered table-responsive' }
    ];


      return {
        //Common options
        options: {
            template: paths.node_modules_fcoo_assets_markdown + '_index.html.tmpl',
            preCompile: function(src, context) { 
                //Remove contents in <en>..</en> in danish versions and <da>..</da> in english versions and remove the tags <da> and </da>
                var tagName  = this.lang == 'da' ? 'en' : 'da',
                    startTag = '<' + tagName + '>',
                    endTag   = '</' + tagName + '>';

                var list = src.split( startTag ); 
                for (var i=0; i<list.length; i++ ){
                    var subList = list[i].split( endTag ); 
                    if (subList.length > 1)
                        subList = subList.slice(1);
                    list[i] = subList.join( endTag );
                }

                src = list.join( startTag );

                //Remove all <da>, </da>, <en>, and </en>
                var tagList = ['<da>', '</da>', '<en>', '</en>'];
                for (var i=0; i<tagList.length; i++ )
                    src = src.split(tagList[i]).join('');

                return src;
            },

            postCompile: function(src, context){
                //Add class-names to different tags
                for (var i=0; i<tagClassList.length; i++ ){
                    var tag     = tagClassList[i].tag,
                        tagList = src.split('<' + tag);
                    src = tagList.join('<' + tag + ' class="' + tagClassList[i].class + '"');
                }
                return src;
            },

            markdownOptions: {
                //renderer: renderer
            }     
        },

        //Options for danish versions
        da: {
            options: { lang: 'da' },
            files  : []
        },
        //Options for english versions
        en: { 
            options: { lang: 'en' },
            files  : []
        }
    }
}