# @tractorzoom/generator-dev-tools

Yeoman generator to add dev tools and configurations to node projects

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) [![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier) [![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com/) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

[![Publish Status](https://github.com/TractorZoom/generator-dev-tools/workflows/publish/badge.svg)](https://github.com/TractorZoom/generator-dev-tools/actions)

## Install

```
npm i -g @tractorzoom/generator-dev-tools
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

-   Circle CI - enables pre-commit hook to validate Circle CI configurations
-   Commitlint - enables pre-commit hook for commitlint and `npm run commit` script for commit wizard
-   Prettier - enables pre-commit hook for prettier
-   Renovate - add renovate configuration
-   S3/CloudFront - add release and PR workflow with GitHub Actions for front-end applications
-   SAM - add deploy workflow with GitHub Actions for SAM deploy for micro services
-   Semantic Release - add release and PR workflows with GitHub Actions for modules using semantic release
-   Terraform - adds script and pre-commit hook for terraform format
-   Jest - adds Jest configuration file
