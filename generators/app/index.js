const _ = require('lodash');
const path = require('path');

var Generator = require('yeoman-generator');

module.exports = class extends Generator {

  constructor(args, opts) {

    super(args, opts);
    const _this = this;

    // Next, add your custom code
    // this.option('babel'); // This method adds support for a `--babel` flag
    _this.defaultLibs = ['lodash', 'async', 'fs-extra', 'glob', 'moment'];
    _this.defaultLibs.forEach(libName => {

      _this.option(libName, {
        desc: `install ${libName}`,
        default: true
      });
    });

    this.option('config', {
      desc: 'install config',
      default: true
    });

    this.option('logging', {
      desc: 'install logging',
      default: true
    });

    this.option('cli', {
      desc: 'install cli',
      default: true
    });

    this.option('license', {
      desc: 'generate license info',
      default: true
    });
  }

  initializing() {

    if (this.options.config) {

      // TODO: we just bypass the options object here, which may not be a good idea..
      this.composeWith(require.resolve('../config'), this.options);
    }

    if (this.options.logging) {

      this.composeWith(require.resolve('../logging'), this.options);
    }

    if (this.options.cli) {

      var deps = ['config', 'logging', 'lodash'];
      var missing = deps.filter(dep => !this.options[dep]);
      if (missing.length > 0) {
        this.env.error(`the --cli option requires the following dependecies: ${ missing.join(', ') }`);
        return;
      }

      this.composeWith(require.resolve('../cli'), this.options);
    }

  }

  prompting() {

    return this.prompt([
      {
        type    : 'input',
        name    : 'author',
        message : 'Your name',
        default : this.user.git.name() // Default to git username
      },
      {
        type    : 'confirm',
        name    : 'express',
        message : 'Do you need Express?'
      }
    ]).then((answers) => {
      
      this.options.author = answers.author;

      if (this.options.license) {

        this.composeWith(require.resolve('generator-license/app'), {
          // Not passing anything for now..
          name: answers.author
        });
      }
    });
  }

  configuring() {

    // Saving configurations and configure the project (creating .editorconfig files and other metadata files)


    const currentPkg = this.fs.readJSON(this.destinationPath('package.json'), {});

    const pkg = _.merge(
      {
        name: this.determineAppname(),
        version: '0.0.0',
        description: '',
        author: this.options.author,
        main: 'index.js',
        scripts: {
          test: 'echo \"Error: no test specified\" && exit 1'
          // TODO: add more here..
        },
        // license will be added by separate module.. for now, this is a default one.
        // license: 'Unlicense'
      },
      currentPkg
    );

    this.fs.extendJSON(this.destinationPath('package.json'), pkg);
  }

  default() {

  }

  writing() {

    // gitignore
    this.fs.copyTpl(
      this.templatePath('gitignore.txt'),
      this.destinationPath('.gitignore')
    );
  }

  install() {

    const _this = this;
    // this.npmInstall(['lodash'], { 'save-dev': true });

    // install default libs
    var libs = _this.defaultLibs.filter(lib => _this.options[lib]);
    this.npmInstall(libs);

  }

  end() {}


};