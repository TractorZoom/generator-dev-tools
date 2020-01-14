# @tractorzoom/generator-dev-tools

Yeoman generator to add dev tools and configurations to node projects

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) [![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier) [![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com/)

## Install

To download make sure the Tractor Zoom GitHub org has been added to your user `.npmrc` file:

**Note: set registry value to whatever registry you are currently using**

```
registry=https://registry.npmjs.org
@tractorzoom:registry=https://npm.pkg.github.com
```

Then:

```
npm i --save @tractorzoom/generator-dev-tools
```

## Usage

Install Yeoman globally

```
npm i -g yo
```

Run generator and choose configurations to add

```
yo @tractorzoom/dev-tools
```

### Configuration Prompts

- Commitlint - enables pre-commit hook for commitlint and `npm run commit` script for commit wizard
- Prettier - enables pre-commit hook for prettier
- Renovate - add renovate configuration
- Terraform - adds script and pre-commit hook for terraform format
