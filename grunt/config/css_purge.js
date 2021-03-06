/**
 * css_purge.js - config for grunt-css-purge
 */

module.exports = function (grunt, options) {

    var paths   = grunt.fcoo.paths;

    return {
        "options": {
            "css_output": paths.temp_dist_APPLICATIONNAME_TIMPSTAMP_css+'NY',
            "css": paths.temp_dist_APPLICATIONNAME_TIMPSTAMP_css,

//            "html": "demo/html/static-jekyll/_site",

            "trim": true,
            "trim_keep_non_standard_inline_comments": false,
            "trim_removed_rules_previous_comment": true,
            "trim_comments": false,
            "trim_whitespace": false,
            "trim_breaklines": false,
    "trim_last_semicolon": false,

    "shorten": true,
    "shorten_zero": false,
    "shorten_hexcolor": false,
    "shorten_hexcolor_extended_names": false,
    "shorten_hexcolor_UPPERCASE": false,
    "shorten_font": false,
    "shorten_background": true,
    "shorten_background_min": 2,
    "shorten_margin": false,
    "shorten_padding": false,
    "shorten_list_style": false,
    "shorten_outline": false,
    "shorten_border": false,
    "shorten_border_top": false,
    "shorten_border_right": false,
    "shorten_border_bottom": false,
    "shorten_border_left": false,
    "shorten_border_radius": false,

    "format": true,
    "format_4095_rules_legacy_limit": false,
    "format_font_family": true,

    "special_convert_rem": false,
    "special_convert_rem_browser_default_px": "16",
    "special_convert_rem_desired_html_px": "10",
    "special_convert_rem_font_size": true,

    "special_reduce_with_html" : false,
    "special_reduce_with_html_ignore_selectors" : [
      "@-ms-",
      ":-ms-",
      "::",
      ":valid",
      ":invalid",
      "+.",
      ":-"
    ],

    "generate_report": true,
    "verbose": true,

    "bypass_media_rules": true,
    "bypass_document_rules": false,
    "bypass_supports_rules": false,
    "bypass_page_rules": false,
    "bypass_charset": false,

    "zero_units": "em, ex, %, px, cm, mm, in, pt, pc, ch, rem, vh, vw, vmin, vmax",
    "zero_ignore_declaration": [],

    "report_file_location": "report/purged_css_report_data.json",

    "reduce_declarations_file_location": "config_reduce_declarations.json"
},


        _options: {
            "verbose"              : false,
            "no_duplicate_property": true,
        },
        files: {
            src : paths.temp_dist_APPLICATIONNAME_TIMPSTAMP_css,
            dest: paths.temp_dist_APPLICATIONNAME_TIMPSTAMP_css
        }



    }
}
