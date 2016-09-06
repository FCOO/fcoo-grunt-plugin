/**
 * CONSOLE
 * 
 */

'use strict';

module.exports = function( grunt ){

   
    /**
     * writelnColor(msg, color, mgs2, color2,..,msgN, colorN) writeln msg in color
     */
    function writelnColor(){
        for(var i=0; i<arguments.length; i=i+2)
            grunt.log.write(arguments[i][arguments[i+1]]);
        grunt.log.writeln('');
    }

    /**
     * writelnYellow(msg) writeln msg in yellow
     */
    function writelnYellow(msg){ 
        writelnColor(msg, 'yellow');
    }

    //writelnRed(msg) writeln msg in red
    //function writelnRed(msg){ writelnColor(msg, 'red'); }

    
   
    
    
    
    
    //Return the module
    return {
        writelnColor : writelnColor,
        writelnYellow: writelnYellow

    };
};
