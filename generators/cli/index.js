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
      this.templatePath('index.js'),
      this.destinationPath('index.js'),
      {
        config: this.options.config,
        logging: this.options.logging,
        express: this.options.express,

      }
    );
  }

  install() {

    const _this = this;
    this.npmInstall(['commander']);



  }

  end() {}


};
