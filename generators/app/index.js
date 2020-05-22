var Generator = require('yeoman-generator');
const fs = require('fs-extra');
const packageJSON = require('../../package.json');
const replace = require('replace-in-file');

const addCircleCIConfiguration = (context) => {
    context.log('Adding Circle CI configuration');

    const pkgJson = {
        scripts: {
            'validate:circle-ci': 'bash ./validate-circle-ci',
        },
    };

    context.fs.extendJSON(context.destinationPath('package.json'), pkgJson);

    fs.copyFileSync(context.templatePath('validate-circle-ci'), context.destinationPath('validate-circle-ci'));
};

const addCommitlintConfiguration = (context) => {
    context.log('Adding Commitlint configuration');

    const pkgJson = {
        config: {
            commitizen: {
                path: 'cz-conventional-changelog',
            },
        },
        devDependencies: {
            '@commitlint/cli': '8.3.5',
            '@commitlint/config-conventional': '8.3.4',
            commitizen: '4.1.2',
            husky: '4.2.5',
        },
        scripts: {
            commit: 'git-cz',
        },
    };

    context.fs.extendJSON(context.destinationPath('package.json'), pkgJson);

    fs.copyFileSync(context.templatePath('commitlint.config.js'), context.destinationPath('commitlint.config.js'));
};

const addPrettierConfiguration = (context) => {
    context.log('Adding Prettier configuration');

    const pkgJson = {
        devDependencies: {
            husky: '4.2.5',
            prettier: '2.0.5',
            'pretty-quick': '2.0.1',
        },
        scripts: {
            'pretty-quick': 'pretty-quick',
            'prettier:all': "prettier --write './**/*.*'",
        },
    };

    context.fs.extendJSON(context.destinationPath('package.json'), pkgJson);

    fs.copyFileSync(context.templatePath('prettier.config.js'), context.destinationPath('prettier.config.js'));
};

const addRenovateConfiguration = (context) => {
    context.log('Adding Renovate configuration');

    const renovateJSON = {
        automerge: true,
        extends: ['config:base'],
        major: {
            automerge: false,
        },
        prConcurrentLimit: 5,
        prHourlyLimit: 10,
    };

    context.fs.extendJSON(context.destinationPath('renovate.json'), renovateJSON);
};

const addSemanticReleaseConfiguration = (context) => {
    context.log('Adding Semantic Release configuration');

    const pkgJson = {
        devDependencies: {
            '@semantic-release/changelog': '5.0.1',
            '@semantic-release/git': '9.0.0',
            '@semantic-release/release-notes-generator': '9.0.1',
            'semantic-release': '17.0.7',
        },
    };

    context.fs.extendJSON(context.destinationPath('package.json'), pkgJson);

    fs.copyFileSync(context.templatePath('release.config.js'), context.destinationPath('release.config.js'));

    if (!fs.existsSync('.github')) {
        fs.mkdirSync('.github');
    }

    if (!fs.existsSync('.github/workflows')) {
        fs.mkdirSync('.github/workflows');
    }

    fs.copyFileSync(
        context.templatePath('.github/workflows/semantic_publish.yml'),
        context.destinationPath('.github/workflows/publish.yml')
    );
    fs.copyFileSync(
        context.templatePath('.github/workflows/semantic_pull_request.yml'),
        context.destinationPath('.github/workflows/pull_request.yml')
    );
};

const addTerraformConfiguration = (context) => {
    context.log('Adding Terraform configuration');

    const pkgJson = {
        scripts: {
            'terraform:fmt': 'sh terraform-format.sh',
        },
    };

    context.fs.extendJSON(context.destinationPath('package.json'), pkgJson);

    fs.copyFileSync(context.templatePath('terraform-format.sh'), context.destinationPath('terraform-format.sh'));
};

const addHuskyConfiguration = (context) => {
    const preCommitTasks = [];

    if (context.answers.prettier) {
        preCommitTasks.push("'pretty-quick --staged'");
    }

    if (context.answers.terraform) {
        preCommitTasks.push("'npm run terraform:fmt'");
    }

    const commitMessageHook = context.answers.commitlint
        ? "        'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',\n"
        : '';

    const huskyConfig =
        "const tasks = arr => arr.join(' && ')\n\n" +
        'module.exports = {\n' +
        '    hooks: {\n' +
        commitMessageHook +
        `        'pre-commit': tasks([${preCommitTasks.join(', ')}]),\n` +
        '    },\n}\n';

    fs.writeFileSync(context.destinationPath('.huskyrc.js'), huskyConfig);
};

const addS3DeployConfiguration = (context) => {
    context.log('Adding S3 deploy configuration');

    const pkgJson = {
        scripts: {
            'build:dev': 'REACT_APP_STAGE=development npm run build',
            'build:prod': 'REACT_APP_STAGE=production npm run build',
            'build:test': 'REACT_APP_STAGE=testing npm run build',
        },
    };

    context.fs.extendJSON(context.destinationPath('package.json'), pkgJson);

    if (!fs.existsSync('.github')) {
        fs.mkdirSync('.github');
    }

    if (!fs.existsSync('.github/workflows')) {
        fs.mkdirSync('.github/workflows');
    }

    fs.copyFileSync(
        context.templatePath('.github/workflows/s3_release.yml'),
        context.destinationPath('.github/workflows/release.yml')
    );
    fs.copyFileSync(
        context.templatePath('.github/workflows/s3_pull_request.yml'),
        context.destinationPath('.github/workflows/pull_request.yml')
    );

    const options = {
        files: context.destinationPath('.github/workflows/release.yml'),
        from: /<<s3-bucket-base-name>>/g,
        to: context.answers.s3DeployBucketName,
    };

    try {
        replace.sync(options);
    } catch (error) {
        context.error('Error replacing s3 bucket base name:', error);
    }
};

const addSAMDeployConfiguration = (context) => {
    context.log('Adding SAM deploy configuration');

    if (!fs.existsSync('.github')) {
        fs.mkdirSync('.github');
    }

    if (!fs.existsSync('.github/workflows')) {
        fs.mkdirSync('.github/workflows');
    }

    fs.copyFileSync(
        context.templatePath('.github/workflows/sam_deploy.yml'),
        context.destinationPath('.github/workflows/deploy.yml')
    );

    const options = {
        files: context.destinationPath('.github/workflows/deploy.yml'),
        from: /<<stack-base-name>>/g,
        to: context.answers.samDeployStackName,
    };

    try {
        replace.sync(options);
    } catch (error) {
        context.error('Error replacing s3 bucket base name:', error);
    }
};

const addJestConfiguration = (context) => {
    context.log('Adding Jest Configuration');

    fs.copyFileSync(context.templatePath('jest.config.js'), context.destinationPath('jest.config.js'));
};

module.exports = class extends Generator {
    async prompting() {
        this.answers = await this.prompt([
            {
                type: 'confirm',
                name: 'circleCI',
                message: 'Would you like to enable pre-commit hook for Circle CI?',
                store: true,
            },
            {
                type: 'confirm',
                name: 'commitlint',
                message: 'Would you like to enable pre-commit hook for Commitlint?',
                store: true,
            },
            {
                type: 'confirm',
                name: 'prettier',
                message: 'Would you like to enable pre-commit hook for Prettier?',
                store: true,
            },
            {
                type: 'confirm',
                name: 'renovate',
                message: 'Would you like to enable Renovate?',
                store: true,
            },
            {
                type: 'confirm',
                name: 'semanticRelease',
                message: 'Would you like to add a release configuration using semantic-release?',
                store: true,
            },
            {
                type: 'confirm',
                name: 'terraform',
                message: 'Would you like to enable pre-commit hook for Terraform?',
                store: true,
            },
            {
                type: 'confirm',
                name: 's3Deploy',
                message: 'Would you like to add a deploy configuration for S3 and CloudFront?',
                store: true,
            },
            {
                type: 'input',
                name: 's3DeployBucketName',
                message: 'What is the base name of the S3 bucket to deploy to?',
                when: (answers) => answers.s3Deploy,
                validate: (answer) => {
                    if (answer) {
                        return true;
                    }
                    this.log('*** Please enter the base name for the S3 bucket to deploy to (ie foo-bar-client).');
                    return false;
                },
                store: true,
            },
            {
                type: 'confirm',
                name: 'samDeploy',
                message: 'Would you like to add a SAM deploy configuration?',
                store: true,
            },
            {
                type: 'input',
                name: 'samDeployStackName',
                message: 'What is the base stack name of the SAM deploy?',
                when: (answers) => answers.samDeploy,
                validate: (answer) => {
                    if (answer) {
                        return true;
                    }
                    this.log('*** Please enter the base stack name for the SAM deploy (ie foo-bar-service).');
                    return false;
                },
                store: true,
            },
            {
                type: 'confirm',
                name: 'jestConfig',
                message: 'Would you like to add a Jest configuration?',
                store: true,
            },
        ]);
    }

    writing() {
        const shouldAddHuskyConfig = this.answers.commitlint || this.answers.prettier || this.answers.terraform;

        if (this.answers.circleCI) {
            addCircleCIConfiguration(this);
        }

        if (this.answers.commitlint) {
            addCommitlintConfiguration(this);
        }

        if (this.answers.prettier) {
            addPrettierConfiguration(this);
        }

        if (this.answers.renovate) {
            addRenovateConfiguration(this);
        }

        if (this.answers.semanticRelease) {
            addSemanticReleaseConfiguration(this);
        }

        if (this.answers.terraform) {
            addTerraformConfiguration(this);
        }

        if (this.answers.s3Deploy) {
            addS3DeployConfiguration(this);
        }

        if (this.answers.samDeploy) {
            addSAMDeployConfiguration(this);
        }

        if (this.answers.jestConfig) {
            addJestConfiguration(this);
        }

        if (shouldAddHuskyConfig) {
            addHuskyConfiguration(this);
        }
    }

    installing() {
        const shouldInstallNodeModules =
            this.answers.commitlint || this.answers.prettier || this.answers.semanticRelease;

        if (shouldInstallNodeModules) {
            this.npmInstall();
        }
    }

    end() {
        const date = new Date();
        let outputStrings = [
            `\n\n## @tractorzoom/dev-tools version ${packageJSON.version} run on ${date.toDateString()}`,
        ];

        if (this.answers.commitlint) {
            outputStrings.push('### Commitlint/Commitizen');
            outputStrings.push(
                'Add Commitizen badge to your projects README: ' +
                    '[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)'
            );
        }

        if (this.answers.jestConfig) {
            outputStrings.push('### Jest');
            outputStrings.push(
                'Add Jest badge to your projects README: ' +
                    '[![jest](https://jestjs.io/img/jest-badge.svg)](https://github.com/facebook/jest)'
            );
        }

        if (this.answers.prettier) {
            outputStrings.push('### Prettier');
            outputStrings.push(
                'Add Prettier badge to your projects README: ' +
                    '[![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)'
            );
        }

        if (this.answers.renovate) {
            outputStrings.push('### Renovate');
            outputStrings.push(
                'Add Renovate badge to your projects README: ' +
                    '[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com/)'
            );
        }

        if (this.answers.semanticRelease) {
            outputStrings.push('### Semantic Release');
            outputStrings.push(
                'Add Semantic Release badge to your projects README: ' +
                    '[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)'
            );

            outputStrings.push(
                'The release process for semantic-release expects there to be a `build` and `test` script while releasing your module'
            );

            const appNameWithHyphen = this.appname.replace(' ', '-');
            const publishBadge = `[![Publish Status](https://github.com/TractorZoom/${appNameWithHyphen}/workflows/publish/badge.svg)](https://github.com/TractorZoom/${appNameWithHyphen}/actions)`;
            const pullRequestBadge = `[![Publish Status](https://github.com/TractorZoom/${appNameWithHyphen}/workflows/pull_request/badge.svg)](https://github.com/TractorZoom/${appNameWithHyphen}/actions)`;

            outputStrings.push('Add build status badge for publish step to your projects README: ' + publishBadge);
            outputStrings.push(
                'Add build status badge for PR verify step to your projects README: ' + pullRequestBadge
            );
        }

        if (this.answers.circleCI) {
            outputStrings.push('### Circle CI');
            outputStrings.push(
                'Ensure you have the Circle CI command line tools installed for the pre-commit hook to function properly'
            );
        }

        if (this.answers.terraform) {
            outputStrings.push('### Terraform');
            outputStrings.push(
                'Ensure you have the Terraform command line tools installed for the pre-commit hook to function properly'
            );
        }

        if (this.answers.s3Deploy) {
            outputStrings.push('### S3/Cloudfront');
            outputStrings.push(
                'In order for the S3 deploy process to work with GitHub Actions, some env variables need to be set:'
            );
            outputStrings.push(
                '* `AWS_KEY` - AWS key for account with access to manage resources in AWS\n' +
                    '* `AWS_SECRET` - AWS secret for account with access to manage resources in AWS\n' +
                    '* `SLACK_WEBHOOK` - Slack Webhook key for Slack org'
            );

            outputStrings.push(
                'The deploy process for S3 and CloudFront expects there to be a `build` and `test` script'
            );

            const appNameWithHyphen = this.appname.replace(' ', '-');
            const releaseBadge = `[![Publish Status](https://github.com/TractorZoom/${appNameWithHyphen}/workflows/release/badge.svg)](https://github.com/TractorZoom/${appNameWithHyphen}/actions)`;
            const pullRequestBadge = `[![Publish Status](https://github.com/TractorZoom/${appNameWithHyphen}/workflows/pull_request/badge.svg)](https://github.com/TractorZoom/${appNameWithHyphen}/actions)`;

            outputStrings.push('Add build status badge for release step to your projects README: ' + releaseBadge);
            outputStrings.push(
                'Add build status badge for PR verify step to your projects README: ' + pullRequestBadge
            );
        }

        if (this.answers.samDeploy) {
            outputStrings.push('### SAM Deploy');
            outputStrings.push(
                'In order for the SAM Deploy to work with Github Actions, some env variables need to be set:'
            );
            outputStrings.push(
                '* `AWS_ACCESS_KEY_ID`: AWS key for account with access to manage resources in AWS\n' +
                    '* `AWS_SECRET_ACCESS_KEY`: AWS secret for account with access to manage resources in AWS\n'
            );

            const appNameWithHyphen = this.appname.replace(' ', '-');
            const deployBadge = `[![Deploy Status](https://github.com/TractorZoom/${appNameWithHyphen}/workflows/release/badge.svg)](https://github.com/TractorZoom/${appNameWithHyphen}/actions)`;

            outputStrings.push('Add build status badge for deploy step to your projects README: ' + deployBadge);
        }

        if (!fs.existsSync('docs')) {
            fs.mkdirSync('docs');
        }

        fs.appendFileSync(this.destinationPath('docs/generator_output.md'), outputStrings.join('\n\n'));

        this.log('Implementation instructions added to docs/generator_output.md');
    }
};
