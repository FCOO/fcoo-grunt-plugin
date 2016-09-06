/**
 * LOGFILE
 * 
 */

'use strict';

module.exports = function( grunt ){

    /**
     * LogFile = object to create log-files
     */
	var LogFile = function ( options ){
		this.options = options;
        this.txtContents     = [];
        this.txtContentsStr  = '';
        this.mdContents      = []; 
        this.mdContentsStr   = '';
	}

	//Extend the prototype
	LogFile.prototype = {
        writeTxt: function ( line ){
            this.txtContents.push( line );
            return this;
        },
        writeMd: function ( line, extraLF ){
            if (extraLF)
                this.mdContents.push('');  
            this.mdContents.push( line );
            return this;
        },
        write: function ( line, mdPrefix, mdExtraLF ){
            this.writeTxt( line );
            this.writeMd( (mdPrefix ? mdPrefix +' ':'') + line, mdExtraLF );
            return this;
        },

        writeAnyFile: function( fileName, contents ){
            var str = '';
            for (var i=0; i<contents.length; i++ )
                str = str + (i ? grunt.util.linefeed : '') + contents[i];
            grunt.file.write( fileName, str );
            return this;
        },
        writeTxtFile: function( fileName ) { return this.writeAnyFile( fileName, this.txtContents ); },
        writeMdFile : function( fileName ) { return this.writeAnyFile( fileName, this.mdContents  ); },
    }

    //Return the module
    return LogFile;
};
