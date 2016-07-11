[grunt-init]: http://gruntjs.com/project-scaffolding
[fcoo-web-dev]: https://github.com/FCOO/fcoo-web-dev
[grunt]: https://gruntjs.com
[git]: https://git-scm.com
[github]: https://github.com
[grunt_setup.json]: #grunt_setupjson
[grunt-bower-concat]: https://www.npmjs.com/package/grunt-bower-concat

# grunt-fcoo-grunt-plugin

> Grunt plugin used to with a `gruntfile.js` and `packages.json` in repositories to run [grunt][] commands to  validate, check and build web packages and applications 

Used in the development environment described in [fcoo-web-dev][] and normally installed via the FCOO [grunt-init][] templates (`grunt-init-fcoo-[NAME]`)

## Contents
1. [Install and basic use](#install)
2. [Packages tasks](#package-task): List of and specifications for available tasks for *Packages*
2. [Application tasks](#application-task): List of and specifications for available tasks for *Applications*
2. [`gruntfile.js`](#gruntfile.js): Descriptions of the options for  `grunt-fcoo-grunt-plugin`
3. [Main files, dependencies overrides and resolutions](#dependencies): Note on difference between the `overrides` in `bower.json` and `options` in [grunt-bower-concat][]
4. [Miscellaneous](#miscellaneous)



---
<a name="install"></a>
## Install and basic use

### Install the plugin
1. Is automatic installed when running `grunt-init` with one of [FCOO templates](https://github.com/FCOO/fcoo-web-dev#fcoo_template) (recommended), or
2. Clone `gruntfile.js` and `package.json` from [fcoo-gruntdile.js](https://github.com/FCOO/fcoo-gruntfile.js) and manually adjust the files

### gruntfile.js
The [gruntfile.js](`gruntfile.js`) in the repository contains the different options to be used in different tasks. 

### *Application* or *Package*
The contents of a repository can either be a **web application** or a **packages/plugin** and is defined by setting the `isApplication` options in [gruntfile.js](#gruntfile.js) determine if it is an *`Application`* or a *`Package`*

### Run a command/task

To execute a command just run

    	grunt {TASK} {OPTIONS}

<a name="package-task"></a>
---
## Package tasks
- `grunt check` - Check the syntax of all `.js` and `.scss` files in `\src`
- `grunt dev` - Building a development version in `\demo` or `\dev` 
- `grunt build` - Building a production version in `\dist`. Same as`grunt prod`
- `grunt push` - Create a complete new release and push it to GitHub. Same as `grunt github`
- `grunt push-cli {OPTIONS}` - Same as `grunt push` but with options instead of prompt. Same as `grunt github-cli {OPTIONS}`

### `>grunt check`
- Check the syntax of all `.js` files in `\src` using [JSHint](#jshint)
- Check the syntax of all `.scss` in `\src`

### `>grunt dev`
Building a development version in `\demo`

**You only need to run `grunt dev` when you**
- add or delete a source file from `\src`
- install/uninstall a bower-component

To test your package just browse
`\demo\index.html`

- Check syntax of `.js` and `.scss` files in `\src`
- Merge all `overrides` from dependences into `bower.json` temporary
- Update all bower components
- Concat all `.js` and `.css` files in bower components into `\demo\bower_components.js` and `\demo\bower_components.css`
- Copy all images and font files used by bower components to `\demo\images` and `\demo\fonts`
- Copy all files in `\src\_dist_files` to `\demo`
- Restore original `bower.json`

### `>grunt build`
Building a production version in `\dist`

- Check syntax of `.js` and `.scss` files in `\src`
- Concat and minify all `.js` files in `\src` into one file `\dist\[PACKAGENAME].js` and `\dist\[PACKAGENAME].min.js`
- Compile, concat and minify all `.scss` files in `\src` into one file `\dist\PACKAGENAME.css` and `\dist\PACKAGENAME.min.css`
- Copy all images and font files in `\src` to `\dist\images` and `\dist\fonts`
- Copy all files in `\src\_dist_files` to `\dist`

##### Example (packages='*fcoo-plugin*')
	dist/
	  images/
	  fonts/
	  fcoo-plugin.js
	  fcoo-plugin.min.js
	  fcoo-plugin.css
	  fcoo-plugin.min.css


### `>grunt push`
Create a complete new release and push it to [GitHub][]

- Prompt for 
	- new version (patch / minor / major)
	- Commit or Amend (when both are possible)
	- description of the release
- Run `grunt build` *(optional)*
- Update `version` in `bower.json` and `package.json`
- Update `\dist\*.js` with new version
- Add all files in [Git][]. Includes **all** files except those specified in `.gitignore` 
- Commit all files in [Git][]
- Create a new `TAG` with message "*1.2.3*"
- Merge branch `'master'` into branch `'gh-pages'` *(optional)*
- Push all branches and tags to [GitHub][]

##### Example (package='*fcoo-plugin*')
	C:\...\fcoo-plugin>grunt github

	? Build/compile the application? (Y/n) Yes
	? Current version of "fcoo-plugin" is 1.2.3. Select new version: (Use arrow keys)
	  Patch : 1.2.4 Backwards-compatible bug fixes.
	> Minor : 1.3.0 Add functionality in a backwards-compatible manner.
	  Major : 2.0.0 Incompatible API changes.
	  None  : No new version. Just commit and push.
	
	? Above is a list of changes to be commited. Select commit-action: (Use arrow keys)
	> Commit : Committing staged changes to a new snapshot.
	  Amend  : Combine staged changes with the previous commit.

	? Message/description for new version: This is a new version

### `>grunt push-cli {OPTIONS}`
Same as `grunt push` but with options

	`grunt push-cli (--no-build  --build) (--none | --patch | --minor | --major) (--commit="message" | --amend) --tag="Tag message"`
| Options | Default | Description |
| :-- | :--: | :--  |
| `--build` or `--no-build` | `--no-build` | Run `grunt build` or not |
| `--none` or `--patch` or `--minor` or `--major` | `--patch` | Release |
| `--commit="message"` or `--amend` | `--commit=""` | Commit a new snapshot or amend to previous commit |
| `--tag="message"` | `--tag=""` | Message for new tag (only if not `--none`) |

##### Example (package='*fcoo-plugin*')
	C:\...\fcoo-plugin>grunt push-cli --build --minor --commit --tag="This is a new version"

<a name="application-task"></a>
---
## Application tasks
Where there are the following task:
- `grunt check` - Check the syntax of all `.js` and `.scss` files in `\src`
- `grunt dev` - Building a development version in `\demo` or `\dev` 
- `grunt build` - Building a production version in `\dist`

### `>grunt check`
- Check the syntax of all `.js` files in `\src` using [JSHint](#jshint)
- Check the syntax of all `.scss` in `\src`

### `>grunt dev`
Building a development version in `\dev`

**You only need to run `grunt dev` when you**
- add or delete a source file from `\src`
- install/uninstall a bower-component
- changes `src\_body.html` or `src\_head.html`

To test your application just browse
`\dev\index.html`

- Check syntax of `.js` and `.scss` files in `\src`
- Merge all `overrides` from dependences into `bower.json` temporary
- Update all bower components
- Concat all `.js` and `.css` files in bower components into `\demo\bower_components.js` and `\demo\bower_components.css`
- Copy all images and font files used by bower components to `\demo\images` and `\demo\fonts`   
- Copy all files in `\src\_dist_files` `\dev`
- Restore original `bower.json`
- Create `\dev\index.html` from `\src\_index_TEMPLATE-DEV.html`, `\src\_head.html`, and `\src\_body.html`
- Insert<br>`<script src="..src/PATH_AND_FILENAME.js"></script>` and<br>`<link href="..src/PATH_AND_FILENAME.css" rel="stylesheet">`<br>into `dev\index.html`for all js- and css/scss-files in `\src`

### `>grunt build`
Building a production version in `\dist`

- Check syntax of `.js` and `.scss` files in `\src`
- Update all bower components   
- Concat and minify all `.js` files in bower components **AND** in `\src` into one file `\dist\[[APPLICATIONNAME]_[TIMESTAMP].js` and `\dist\[[APPLICATIONNAME]_[TIMESTAMP].min.js`      
- Compile all `.scss` files in `\src` and concat and minify them with all the `.css` files in bower components **AND** in `\src` into one file `\dist\[[APPLICATIONNAME]_[TIMESTAMP].css` and `\dist\[[APPLICATIONNAME]_[TIMESTAMP].min.css`
- Create `\dist\index.html` from `\src\_index_TEMPLATE.html`, `\src\_head.html`, and `\src\_body.html`
- Create `\dist\index-dev.html` as `\dist\index-dev.html` but with the non-minified versions of js- and css-files
- Copy all images and font files used by bower components to `\dist\images` and `\dist\fonts`   
- Copy all images and font files in `\src` to `\dist\images` and `\dist\fonts`
- Copy all files in `\src\_dist_files` to `\dist`


##### Example (application='*fcoo-app*')
	dist/
	  images/
	  fonts/
	  index.html
	  index-dev.html
	  fcoo-app_2015-12-24-13_22_50.js
	  fcoo-app_2015-12-24-13_22_50.min.js
	  fcoo-app_2015-12-24-13_22_50.css
	  fcoo-app_2015-12-24-13_22_50.min.css



<a name="gruntfile.js"></a>

---
## gruntfile.js

Contains inclusion of the grunt-plugin and the different options to define the type of application, extra commands etc.

	grunt.initConfig({
		fcoo_grunt_plugin: {
			options: {

	"isApplication" : false,  //true for stand-alone applications. false for packages/plugins
	"haveJavaScript": true,	//true if the packages have js-files
	"haveStyleSheet": true,	//true if the packages have css and/or scss-files
	"haveGhPages"   : true,	//true if there is a branch "gh-pages" used for demos

	"minimizeBowerComponentsJS" : true, //Only for application: Minifies the bower components js-file	
	"minimizeBowerComponentsCSS": true, //Only for application: Minifies the bower components css-file		

	"beforeProdCmd": "",  //Cmd to be run at the start of prod-task. Multi cmd can be separated by "&"
	"beforeDevCmd" : "",	//Cmd to be run at the start of dev-task. Multi cmd can be separated by "&"
	"afterProdCmd" : "",	//Cmd to be run at the end of prod-task. Multi cmd can be separated by "&"
	"afterDevCmd"   : "",	//Cmd to be run at the end of dev-task. Multi cmd can be separated by "&"

	"exitOnJSHintError"  : true,  //if false any error in JSHint will not exit the task
	"cleanUp"            : true,	//In debug: set to false
	"bowerCheckExistence": true,	//true=all bower components must be present. false=allows missing files (only in debug)
	"bowerDebugging"     : false

			}
		}
	});//end of grunt.initConfig({...





<a name="dependencies"></a>

---
## Main files, dependencies and overrides
The `grunt-fcoo-grunt-plugin` using [grunt-bower-concat][] to find the included packages and there dependencies and concat all the js- and css-files.

### Main files
Some Bower components don’t list their main files or (more likely) don’t have `bower.json` file at all. 
In this case you can add an `overrides` section in the `bower.json` and add the missing main files

	 "overrides": {
		"package_name": {
      		"main": [
        		"dist/package_name.js",
        		"dist/package_name.css"
      		]
    	}
	}

The `grunt-fcoo-grunt-plugin` will find all the `overrides` from dependences and copy them temporary  into `bower.json`

### Dependencies       
Unfortunately `bower.json` and [grunt-bower-concat][] don't implement *dependencies* in there json-files the same way 

#### `bower.json`
In `bower.json` you can specify that a package should use a specify version of another package

Eq.: In the bower-file for *leaflet.locatecontrol* it is specify that *leaflet.locatecontrol* is using leaflet version 0.7.3, but in you project you are using leaflet version 0.7.7. To avoid conflicts you can override the dependencies for  *leaflet.locatecontrol*
	
	 "overrides": {
		"leaflet.locatecontrol": {
      		"dependencies": {
        		"leaflet": "0.7.7"
      		}
    	}
	}

##### grunt-bower-concat
[grunt-bower-concat][] don't seem to read or use the `overrides` section in `bower.json`. 
Instead `options.dependencies` is used to fix that not all Bower components list their dependencies. If components concatenate in the wrong order, the `options.dependencies` can dependencies for those components.
Eq:

	dependencies: {
	  'underscore': 'jquery',
	  'mygallery': ['jquery', 'fotorama']
	}

**BUT** this only works if **all** dependencies is missing in `bower.json` (eq. for "*mygallery*")
It can **not** be used to *add* or *alter* dependencies and there are no options for alter version dependencies.  

#### Conclusion

- `grunt-fcoo-grunt-plugin` will find all the `resolutions` from dependences and copy them temporary  into `bower.json`
- `grunt-fcoo-grunt-plugin` will find all the `overrides` from dependences and copy them temporary  into `bower.json`
- For both `resolutions` and `overrides`:
	- If the application/package has `resolutions` or `overrides` for the a packages => this `resolutions` or `overrides` is used 
	- If the application/package **don't** have `resolutions` or `overrides` for the a packages => using the `resolutions` or `overrides` from the first dependences package with `resolutions` or `overrides` for the packages
	- A warning will be displayed if two or more packages in `dependencies` has `resolutions` or `overrides` for the same packages.
- `grunt-fcoo-grunt-plugin` will read and convert the `overrides.PACKAGENAME.`**`main`** in `bower.json` to the correct options format for [grunt-bower-concat][]
- The `grunt-fcoo-grunt-plugin` will **not** read or convert the `overrides.PACKAGENAME.`**`dependencies`** in `bower.json` and any missing dependencies in included packages must be solved in an other way, e.g. by forking the package and correcting the `bower.json` file



<a name="miscellaneous"></a>
---
## Miscellaneous
### Credential Helper
 On `Windows` you can use a [credential helper](http://windows.microsoft.com/en-us/windows7/manage-stored-passwords-certificates-and-other-credentials) to tell [Git][] to remember your GitHub username and password every time it talks to GitHub. Just run

    git config --global credential.helper wincred

To stop it run

	git config --global --unset credential.helper

### Edit
To publish a new version of the plugin do the following
1.	Editing the tast-file `tasks/fcoo_grunt_plugin.js`
2.	Commit the changes to `git`
3.	Run `>npm version [patch | minor | major]`
4.	Run `>npm publish`
5.	Push the package to github (optional)



