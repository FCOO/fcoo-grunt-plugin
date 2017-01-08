/**
 * OPTIONS - Read options from gruntfile.js and return an object with all settings
 * 
 */

'use strict';

module.exports = function( grunt ){

    var common  = grunt.fcoo.common;

    //Functions to calculate brightness
  	function getBrightness( hex ) {
        var r = parseInt( hex.substr(2+0*2, 2), 16),
		    g = parseInt( hex.substr(2+1*2, 2), 16),
		    b = parseInt( hex.substr(2+2*2, 2), 16);
            
    	function lin2log(n) { return n <= 0.0031308 ? n * 12.92 : 1.055 * Math.pow(n,1/2.4) - 0.055; }
        function log2lin(n) { return n <= 0.04045   ? n / 12.92 : Math.pow(((n + 0.055)/1.055),2.4); }
		r = log2lin( r/255 );
	    g = log2lin( g/255 );
    	b = log2lin( b/255 );
		return lin2log(0.2126 * r + 0.7152 * g + 0.0722 * b) * 100;
	};

    
    //Default options and values
    var defaultOptions = {
           "application"   : false,    //false (default) for packages/plugins. {id, color, favicon,...} for stand-alone applications
            "haveJavaScript": true,     //true if the application/packages have js-files
            "haveStyleSheet": true,     //true if the application/packages have css and/or scss-files
            "haveGhPages"   : true,     //Only for packages: true if there is a branch "gh-pages" used for demos

            "beforeProdCmd" : "",       //Cmd to be run at the start of prod-task. Multi cmd can be seperated by "&"
            "beforeDevCmd"  : "",       //Cmd to be run at the start of dev-task
            "afterProdCmd"  : "",       //Cmd to be run at the end of prod-task
            "afterDevCmd"   : "",       //Cmd to be run at the end of dev-task

            "DEBUG"         : false
        },

        fcooColor    = "#214b87", //Default "FCOO-blue"
        
        //Default application-options
        defaultApplicationOptions = {
            "id"          : 0,          //application id. Default=0
            "name"        : "FCOO.dk",  //application name. Default="FCOO.dk"
            "color"       : fcooColor,  //background-color of favicons. Default="" => blue color of FCOO's logo. Must have format "#123456"
        }
    
    
    //Get options
    var options = grunt.config.get('fcoo_grunt_plugin').default;

    //Updates options with missing options from defaultOptions
    common.updateOptions( options, defaultOptions);
        

    //Tasts avaliable
    options.avaliableTasks = []; 


    //Setting isApplication and update options.application with default options 
    options.isApplication = !!options.application;

    if (options.isApplication){
        //Update options.application
        common.updateOptions( options.application, defaultApplicationOptions );

        //If no application.faviconColor is given => select FCOO-blue or white
        if (!options.application.faviconColor){
            var colorBrightness   = getBrightness( options.application.color ),
                maxBrightnessDiff = 0,

            //faviconColorList = list of colors for the favicon
            faviconColorList  = [fcooColor, '#ffffff'];

            for (var i=0; i<faviconColorList.length; i++ ){
                var brightnessDiff = Math.abs( colorBrightness - getBrightness( faviconColorList[i] ) );
                if (brightnessDiff > maxBrightnessDiff){
                    maxBrightnessDiff = brightnessDiff;
                    options.application.faviconColor = faviconColorList[i];
                }
            }
        }
    }
    

    //Create replace-options for task "replace:dist_temp_ALL_application_options" that inserts
    //all id:value in options.applications as "{APPLICATION_[ID]}" replaced by value
    //plus some default options taken from bower.json
    options.applicationOptionsReplacements = []; //[] of {from, to}
    for (var id in options.application)
        if ( options.application.hasOwnProperty( id ) )
            options.applicationOptionsReplacements.push({
                from: '{APPLICATION_'+id.toUpperCase()+'}',
                to  : options.application[ id ]
            });

    
    //Setting avaliable tasks and fixed options - used to fix older settings
    options.avaliableTasks.push('check', 'dev');
    if (options.isApplication){
      options.haveGhPages = false;
      options.avaliableTasks.push('build', 'release');
    }
    else {
        options.avaliableTasks.push('prod', 'build', 'push', 'push-cli', 'github', 'github-cli');
    }

    //Add tasks to deployment if it is an application and secret.json is available 
    if (options.isApplication && (common.readJSONFile('secret.json') !== {}))
        options.haveDeplomentTasks = true;


    //**************************************************************************************
    //id for easy syntax
    options.isPackage       = !options.isApplication;

    options.haveStyleSheet  = !!options.haveStyleSheet;
    options.haveJavaScript  = !!options.haveJavaScript;
    options.haveGhPages     = !!options.haveGhPages;

    options.DEBUG           = !!options.DEBUG;
    options.notDEBUG        = !options.DEBUG;

    //Global variables use by different tasks        
    var bwr = common.readJSONFile('bower.json');
    
    options.currentVersion = bwr.version;
    options.name           = bwr.name;
    options.title          = 'fcoo.dk - ' + options.name;

    var timeStamp = grunt.template.today("yyyy-mm-dd-HH-MM-ss");
    options.APPLICATIONNAME_TIMPSTAMP = options.name.toLowerCase().replace(' ','_') + '_' + (options.DEBUG ? 'TIMESTAMP' : timeStamp);

  
    //Add default options to applicationOptionsReplacements
    options.applicationOptionsReplacements.push(
        { from: '{APPLICATION_VERSION}', to: options.currentVersion }, 
        { from: '{APPLICATION_BUILD}',   to: timeStamp              } 
    );
    
    
    //Return the module
    return options;
};
