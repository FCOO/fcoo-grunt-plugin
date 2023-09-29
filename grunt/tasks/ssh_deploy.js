/**********************************************************************
ssh_deploy

This is a adapted version of grunt-ssh-deploy

https://github.com/dcarlson/grunt-ssh-deploy

Copyright (c) 2014 Dustin Carlson
Licensed under the MIT license.
**********************************************************************/
'use strict';

module.exports = function(grunt) {
    return [function(){

    var isDeployTask = process.env.IS_DEPLOY == 'DEPLOY';

    var paths            = grunt.fcoo.paths,
        _deploy          = grunt.fcoo.deploy,

        path             = require('path'),
        Connection       = require('ssh2'),
        client           = require('scp2'),
        moment           = require('moment'),
        async            = require('async'),
        childProcessExec = require('child_process').exec,
        extend           = require('extend');


/*
        getDeployOptions : getDeployOptions,
        getSelectedDeploy: getSelectedDeploy,
        getDeployPath    : getDeployPath

*/
    var done          = grunt.task.current.async(),
//HER    var done          = this.async(),
        deployOptions = _deploy.getDeployOptions(),
        secret        = deployOptions.secret;

    var options = extend({},
            secret, {
            localPath       : paths.temp,
            tag             : moment().format('YYYYMMDDHHmmssSSS'),
            currentSymlink  : deployOptions.currentSymlink,
            previousSymlink : deployOptions.previousSymlink,
            releaseRoot     : deployOptions.releaseRoot,
            deployPath      : _deploy.getDeployPath(),

            releasesToKeep  : deployOptions.releasesToKeep,
            readyTimeout    : deployOptions.readyTimeout,
            maxBuffer       : deployOptions.maxBuffer,

            exclude         : [],

            debug           : grunt.fcoo.options.DEBUG
        });

    var releasePath         = path.posix.join(options.deployPath, options.releaseRoot, '/', options.tag),
        currentSymlink      = path.posix.join(options.deployPath, options.currentSymlink),
        previousSymlink     = path.posix.join(options.deployPath, options.previousSymlink),
        showLog             = options.debug,

        isProtected         = _deploy.getSelectedDeploy().protected,
        webPath             = _deploy.getWebPath(),
        webPathProtected    = _deploy.getWebPathProtected();

    if (isDeployTask){
        //Display info
        grunt.log.writeln(currentSymlink + ' -> ' + releasePath);

        if (showLog){
            console.log('currentSymlink = ',    currentSymlink);
            console.log('previousSymlink = ',   previousSymlink);
            console.log('releasePath = ',       releasePath);
            console.log('isProtected = ',       isProtected);
            console.log('webPath = ',           webPath);
            console.log('webPathProtected = ',  webPathProtected);
        }
    }

    //Create and set scp defaults
    var scpOptions = {
        port        : options.port,
        host        : options.host,
        username    : options.username,
        readyTimeout: options.readyTimeout
    };

    if (options.privateKey) {
        scpOptions.privateKey = options.privateKey;
        if (options.passphrase)
            scpOptions.passphrase = options.passphrase;
    }
    else
        if (options.password)
            scpOptions.password = options.password;
        else
            if (options.agent)
                scpOptions.agent = options.agent;
            else
                throw new Error('Agent, Password or private key required for secure copy.');

    client.defaults( scpOptions );

    //Create Connection and connect
    var c = new Connection();
    c.on('connect', function() {
        grunt.log.subhead('Connecting to ' + options.host);
    });
    c.on('ready', function() {
        grunt.log.ok('Connected to ' + options.host+' '+isDeployTask);
        // execution of tasks
        execCommands(options, c, isDeployTask);
    });
    c.on('error', function(err) {
        grunt.log.subhead("Error :: " + options.host);
        grunt.log.errorlns(err);
        if (err) {throw err;}
    });
    c.on('close', function(had_error) {
        grunt.log.subhead("Closed :: " + options.host);
        return true;
    });
    c.connect(options);

    /***************************************************
    execCommands - Excec all the commands needed
    ***************************************************/
    function execCommands(options, connection, isDeploy){

        var cmdList = [],
            cmdIndex = 0;

        //writeHeaderAndCmd - write "2/10 Header /n >>cmd" on the screen
        function writeHeaderAndCmd( header, cmd ){
            if (header){
                cmdIndex++;
                grunt.log.writeln('');
                grunt.log.subhead(cmdIndex+'/'+cmdList.length+' '+header);
            }

            if (cmd){
                var list = cmd.split(' && ');
                for (var i=0; i < list.length; i++)
                    grunt.log.writeln('>>'+list[i]);
            }
        }

        //execLocal
        function execLocal(cmd, next, header) {
        	var execOptions = {
        		maxBuffer: options.maxBuffer
        	};

            writeHeaderAndCmd( header, cmd );

            childProcessExec(cmd, execOptions, function(err, stdout, stderr){
                grunt.log.debug(cmd);
                grunt.log.debug('stdout: ' + stdout);
                grunt.log.debug('stderr: ' + stderr);
                if (err !== null) {
                    grunt.log.errorlns('exec error: ' + err);
                    grunt.log.subhead('Error deploying. Closing connection.');

                    deleteRelease(closeConnection);
                } else {
                    next();
                }
            });
        }

        // executes a remote command via ssh
        function execRemote(cmd, next, header){
            //showLog not used?

            writeHeaderAndCmd( header, cmd );

            connection.exec(cmd, function(err, stream) {
                if (err) {
                    grunt.log.errorlns(err);
                    grunt.log.subhead('ERROR DEPLOYING. CLOSING CONNECTION AND DELETING RELEASE.');

                    deleteRelease(closeConnection);
                }
                stream.on('data', function(data, extended) {
                    grunt.log.debug((extended === 'stderr' ? 'STDERR: ' : 'STDOUT: ') + data);
                });
                stream.on('end', function() {
                    grunt.log.debug('REMOTE: ' + cmd);
                    if(!err) {
                        next();
                    }
                });
            });
        }

        //zipForDeploy
        function zipForDeploy(callback) {
            childProcessExec('tar --version', function (error, stdout, stderr) {
                if (!error) {
                    var isGnuTar = stdout.match(/GNU tar/);
                    var command = "tar -czvf ./deploy.tgz";

                    if (options.exclude.length)
                        options.exclude.forEach(function(exclusion) {
                            command += ' --exclude=' + exclusion;
                        });

                    if (isGnuTar)
                        command += " --exclude=deploy.tgz --ignore-failed-read --directory=" + options.localPath + " .";
                    else
                        command += " --directory=" + options.localPath + " .";

                    execLocal(command, callback, 'Zipping folder');
                }
            });
        }

        //onBeforeDeploy
        function onBeforeDeploy(callback){
            writeHeaderAndCmd('Running Pre-Deploy Commands');

            var command = options.before_deploy;

            if (command instanceof Array)
                async.eachSeries(command, function(command, callback) {
                    execRemote(command, callback);
                }, callback);
            else
                execRemote(command, callback);
        }


        //createReleases
        function createReleases(callback) {
            var command = 'mkdir -p ' + releasePath;
            execRemote(command, callback, 'Creating new release');
        }

        //scpBuild
        function scpBuild(callback) {
            var build = options.zip_deploy ? 'deploy.tgz' : options.localPath;

            writeHeaderAndCmd('Uploading new release');

            grunt.log.debug('SCP FROM LOCAL: ' + build + '\n TO REMOTE: ' + releasePath);
            client.scp(
                build,
                {path: releasePath},
                function(err){
                    if (err)
                        grunt.log.errorlns(err);
                    else {
                        grunt.log.ok('New Build uploaded');
                        callback();
                    }
                }
            );
        }

        //unzipOnRemote
        function unzipOnRemote(callback) {
            var goToCurrent = "cd " + releasePath;
            var untar = "tar -xzvf deploy.tgz";
            var cleanup = "rm " + path.posix.join(releasePath, "deploy.tgz");
            var command = goToCurrent + " && " + untar + " && " + cleanup;
            execRemote(command, callback, 'Unzip zipfile');
        }


        //updateSymlink
        function updateSymlink(callback) {
            var list = [
                    //Set/update symlink for src-files
                    'rm -f ' + previousSymlink ,                                                                    //Remove previoud
                    'if [ -L ' + currentSymlink + ' ]; then mv ' + currentSymlink + ' ' + previousSymlink + '; fi', //If current exists => rename current to previous
                    'ln -s ' + releasePath + ' ' + currentSymlink,                                                  //Set current to new release

                    //Set/update links to application
                    'rm -f ' + webPath,                                                             //Remove web-path
                    'rm -f ' + webPathProtected,                                                    //Remove protected web-path
                    'ln -s ' + currentSymlink + ' ' + (isProtected ? webPathProtected : webPath)    //Set normal or protected web to current
               ];

            execRemote(list.join(' && '), callback, 'Updating sym link');
        }


        //rollback
        function rollback(callback){
            var cmd =
                    ''
                    + 'if [ -L ' + previousSymlink + ' ]; then '
                    + 'rm -rf "$(readlink -f ' + currentSymlink + ')"; '      //Delete contents of current sym link. Eq. rm -rf "$(readlink -f /home/prod/applications/ifm-maps-brs/current)"
                    + 'mv ' + previousSymlink + ' ' + currentSymlink + '; '   //Set current sym link = previous sym lin . Eq. mv /home/prod/applications/ifm-maps-brs/previous /home/prod/applications/ifm-maps-brs/current
                    + 'fi'
                    + '';
            /*
            if [ -L /home/prod/applications/ifm-maps-devel01/previous ]; then
                rm -rf "$(readlink -f /home/prod/applications/ifm-maps-devel01/current)"
                mv /home/prod/applications/ifm-maps-devel01/previous /home/prod/applications/ifm-maps-devel01/current
            fi
            */

            execRemote(cmd, callback, 'Rollback to previous release');
        }

        //deleteRelease
        function deleteRelease(callback) {
            grunt.log.writeln('');
            grunt.log.subhead('Deleting Release');
            execRemote('rm -rf ' + releasePath, callback);
        }

        //onAfterDeploy
        function onAfterDeploy(callback){
            writeHeaderAndCmd('Running Post-Deploy Commands');

            var command = options.after_deploy;

            if (command instanceof Array)
                async.eachSeries(command, function(command, callback) {
                    execRemote(command, callback);
                }, callback);
            else
                execRemote(command, callback);
        }

        //remoteCleanup
        function remoteCleanup(callback) {
            if (options.releasesToKeep < 2)
                options.releasesToKeep = 2;

            var command =
                    "cd " + path.posix.join(options.deployPath, options.releaseRoot, '/') +
                    " && " +
                    "rm -rfv `ls -r " + path.posix.join(options.deployPath, options.releaseRoot, '/') + " | awk 'NR>" + options.releasesToKeep + "'`";

            execRemote(command, callback, 'Removing old releases. Keeping last ' + options.releasesToKeep + ' releases');
        }


        //deleteZip
        function deleteZip(callback) {
            var command = 'rm deploy.tgz';
            execLocal(command, callback, 'Local cleanup');
        };


        //closeConnection - Closing connection to remote server
        function closeConnection(callback) {
            connection.end();

            client.close();
            client.__sftp = null;
            client.__ssh = null;

            callback();
        };

        //Create list of commands
        cmdList = [];



        if (isDeploy){
            if (options.before_deploy)
                cmdList.push(onBeforeDeploy);

            if (options.zip_deploy)
                cmdList.push(zipForDeploy);

            cmdList.push( createReleases );

            cmdList.push( scpBuild );

            if (options.zip_deploy)
                cmdList.push( unzipOnRemote );

            cmdList.push( updateSymlink );

            if (options.after_deploy)
                cmdList.push( onAfterDeploy );

            cmdList.push( remoteCleanup );

            if (options.zip_deploy)
                cmdList.push( deleteZip );
        }
        else
            cmdList.push( rollback );

        cmdList.push( function(){
            writeHeaderAndCmd( 'Closing connection');
            return closeConnection.apply(null, arguments);
         });


        //DEPLOY OR ROLLBACK!
        async.series(cmdList, done);

    };


}]  //End og return [function(){...
};  //End of
