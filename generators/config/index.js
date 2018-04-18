var Generator = require('yeoman-generator');

module.exports = class extends Generator {

  constructor(args, opts) {

    super(args, opts);
    const _this = this;


  }

  initializing() {
    // this.composeWith(require.resolve('../config'));
    // this.composeWith(require.resolve('../logging'));
  }

  prompting() {


  }

  configuring() {

    // Saving configurations and configure the project (creating .editorconfig files and other metadata files)

  }

  default() {

  }

  writing() {

    // gitignore
    this.fs.copyTpl(
      this.templatePath('default.js'),
      this.destinationPath('config/default.js'),
      {
        logging: this.options.logging,
        adapter: this.options.adapter,
        express: false, // TODO: add later
      }
    );
  }

  install() {

    const _this = this;
    this.npmInstall(['config']);



  }

  end() {}


};
