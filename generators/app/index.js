var Generator = require("yeoman-generator");

module.exports = class extends Generator {
  initializing() {
    this.composeWith(require.resolve("../name"));
    this.composeWith(require.resolve("../cool"));
  }
};
