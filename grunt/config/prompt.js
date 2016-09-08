/**
 * prompt.js - config for grunt-prompt
 */

module.exports = function ( grunt ) {

    var options = grunt.fcoo.options,
        semver  = require('semver');

    return {
        github_build_version: {
            options: {
                questions: [
                    {
                        config : 'build',
                        type   : 'confirm',
                        message: 'Build/compile the '+(options.isApplication ? 'application' : 'packages')+'?', // Question to ask the user, function needs to return a string,
                    },
                    {
                        config : 'newVersion',
                        type   : 'list',
                        message: 'Current version of "' + options.name +'" is ' + options.currentVersion + '. Select new release version:',
                        choices: [
                            { value: 'patch', name: 'Patch : ' + semver.inc(options.currentVersion, 'patch') + ' Backwards-compatible bug fixes.' },
                            { value: 'minor', name: 'Minor : ' + semver.inc(options.currentVersion, 'minor') + ' Add functionality in a backwards-compatible manner.' },
                            { value: 'major', name: 'Major : ' + semver.inc(options.currentVersion, 'major') + ' Incompatible API changes.'},
                            { value: 'none',  name: 'None  : No new version. Just commit and push.'},
                        ]
                    },
                ]
            }
        }, //end of prompt.github_build_version

        // ** github_commit **
        github_commit: {
            options: {
                questions: [
                    {
                        config : 'commit',
                        type   : 'list',
                        message: 'Select commit-action:',
                        choices: [
                            { value: 'commit', name: 'Commit : Committing staged changes to a new snapshot.' },
                            { value: 'amend',  name: 'Amend  : Combine staged changes with the previous commit.' },
                        ]
                    }
                ]
            }
        }, //end of github_commit

        github_commit_message: { options: { questions: [{ config: 'commitMessage', type: 'input',   message: 'Message/description for new commit:'  }] } },
        github_tag_message   : { options: { questions: [{ config: 'tagMessage',    type: 'input',   message: 'Message/description for tag/release:' }] } },
        continue             : { options: { questions: [{ config: 'continue',      type: 'confirm', message: 'Continue?'                            }] } } 

    }
}