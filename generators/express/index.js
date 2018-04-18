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

    // express boilerplate
    this.fs.copyTpl(
      this.templatePath('http-server.js'),
      this.destinationPath('lib/http-server.js'),
      {
        // config: this.options.config,
        logging: this.options.logging,

      }
    );

    // TODO: Add generation for auth, router, etc.
  }

  install() {

    const _this = this;
    this.npmInstall(['express', 'body-parser']);



  }

  end() {}


};
