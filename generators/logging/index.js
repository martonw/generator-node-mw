var Generator = require('yeoman-generator');

module.exports = class extends Generator {

  constructor(args, opts) {

    super(args, opts);
    const _this = this;


  }

  initializing() {

  }

  prompting() {

  }

  configuring() {

    // Saving configurations and configure the project (creating .editorconfig files and other metadata files)

  }

  default() {

  }

  writing() {

    // logging js files
    this.fs.copyTpl(
      this.templatePath('logging.js'),
      this.destinationPath('lib/logging.js'),
      {
        config: this.options.config
      }
    );

    this.fs.copyTpl(
      this.templatePath('logging.mockup.js'),
      this.destinationPath('lib/logging.mockup.js')
    );
  }

  install() {

    const _this = this;
    this.npmInstall(['bunyan']);



  }

  end() {}


};
