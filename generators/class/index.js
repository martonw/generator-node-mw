const _ = require('lodash');
const path = require('path');

var Generator = require('yeoman-generator');

module.exports = class extends Generator {

  constructor(args, opts) {

    super(args, opts);
    const _this = this;

    this.option('path', {
      desc: 'class path',
      type: String
    })

  }

  initializing() {

  }

  prompting() {

    if (!this.options.path) {
      return this.prompt([
        {
          type    : 'input',
          name    : 'path',
          message : 'Path of the new class file',
          default : './lib/my-class.js'
        }
      ]).then((answers) => {

        this.options.path = answers.path;
      });
    }
  }

  configuring() {

    // Saving configurations and configure the project (creating .editorconfig files and other metadata files)

  }

  default() {

  }

  writing() {

    // class
    var fileName = path.basename(this.options.path);
    var className = _.upperFirst(_.camelCase(fileName.replace(/\.js$/, '')));

    this.fs.copyTpl(
      this.templatePath('class.js'),
      this.destinationPath(this.options.path),
      {
        logging: this.options.logging,
        className: className,
        fileName: fileName
      }
    );

    this.fs.copyTpl(
      this.templatePath('class.spec.js'),
      this.destinationPath(this.options.path.replace(/\.js$/, '.spec.js')),
      {
        logging: this.options.logging,
        className: className,
        fileName: fileName
      }
    );

  }

  install() {

  }

  end() {}


};
