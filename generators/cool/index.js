var Generator = require("yeoman-generator");

module.exports = class extends Generator {
  async prompting() {
    this.answers = await this.prompt([
      {
        type: "confirm",
        name: "cool",
        message: "Would you like to enable the Cool feature?"
      }
    ]);
  }

  writing() {
    this.log("super cool feature", this.answers.cool);
  }
};
