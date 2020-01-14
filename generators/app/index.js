var Generator = require('yeoman-generator')
const fs = require('fs-extra')

const addCircleCIConfiguration = context => {
    context.log('Adding Circle CI configuration')

    const pkgJson = {
        scripts: {
            'validate:circle-ci': 'bash ./validate-circle-ci',
        },
    }

    context.fs.extendJSON(context.destinationPath('package.json'), pkgJson)

    fs.copyFileSync(context.templatePath('validate-circle-ci'), context.destinationPath('validate-circle-ci'))
}

const addCommitlintConfiguration = context => {
    context.log('Adding Commitlint configuration')

    const pkgJson = {
        config: {
            commitizen: {
                path: 'cz-conventional-changelog',
            },
        },
        devDependencies: {
            '@commitlint/cli': '^8.2.0',
            '@commitlint/config-conventional': '^8.2.0',
            commitizen: '^4.0.3',
            husky: '^3.1.0',
        },
        scripts: {
            commit: 'git-cz',
        },
    }

    context.fs.extendJSON(context.destinationPath('package.json'), pkgJson)

    fs.copyFileSync(context.templatePath('commitlint.config.js'), context.destinationPath('commitlint.config.js'))
}

const addPrettierConfiguration = context => {
    context.log('Adding Prettier configuration')

    const pkgJson = {
        devDependencies: {
            husky: '^3.1.0',
            prettier: '^1.19.1',
            'pretty-quick': '^2.0.1',
        },
        scripts: {
            'pretty-quick': 'pretty-quick',
        },
    }

    context.fs.extendJSON(context.destinationPath('package.json'), pkgJson)

    fs.copyFileSync(context.templatePath('prettier.config.js'), context.destinationPath('prettier.config.js'))
}

const addRenovateConfiguration = context => {
    context.log('Adding Renovate configuration')

    const renovateJSON = {
        extends: ['config:base'],
        prConcurrentLimit: 5,
        prHourlyLimit: 10,
    }

    context.fs.extendJSON(context.destinationPath('renovate.json'), renovateJSON)
}

const addTerraformConfiguration = context => {
    context.log('Adding Terraform configuration')

    const pkgJson = {
        scripts: {
            'terraform:fmt': 'sh terraform-format.sh',
        },
    }

    context.fs.extendJSON(context.destinationPath('package.json'), pkgJson)

    fs.copyFileSync(context.templatePath('terraform-format.sh'), context.destinationPath('terraform-format.sh'))
}

const addHuskyConfiguration = context => {
    const preCommitTasks = []

    if (context.answers.prettier) {
        preCommitTasks.push("'pretty-quick --staged'")
    }

    if (context.answers.terraform) {
        preCommitTasks.push("'npm run terraform:fmt'")
    }

    const commitMessageHook = context.answers.commitlint
        ? "        'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',\n"
        : ''

    const huskyConfig =
        "const tasks = arr => arr.join(' && ')\n\n" +
        'module.exports = {\n' +
        '    hooks: {\n' +
        commitMessageHook +
        `        'pre-commit': tasks([${preCommitTasks.join(', ')}]),\n` +
        '    },\n}\n'

    fs.writeFileSync(context.destinationPath('.huskyrc.js'), huskyConfig)
}

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
                name: 'terraform',
                message: 'Would you like to enable pre-commit hook for Terraform?',
                store: true,
            },
        ])
    }

    writing() {
        const shouldAddHuskyConfig = this.answers.commitlint || this.answers.prettier || this.answers.terraform

        if (this.answers.circleCI) {
            addCircleCIConfiguration(this)
        }

        if (this.answers.commitlint) {
            addCommitlintConfiguration(this)
        }

        if (this.answers.prettier) {
            addPrettierConfiguration(this)
        }

        if (this.answers.renovate) {
            addRenovateConfiguration(this)
        }

        if (this.answers.terraform) {
            addTerraformConfiguration(this)
        }

        if (shouldAddHuskyConfig) {
            addHuskyConfiguration(this)
        }
    }

    installing() {
        this.npmInstall()
    }

    end() {
        if (this.answers.commitlint) {
            this.log(
                'Add Commitizen badge to your projects README: ',
                '[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)'
            )
        }

        if (this.answers.prettier) {
            this.log(
                'Add Prettier badge to your projects README: ',
                '[![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)'
            )
        }

        if (this.answers.renovate) {
            this.log(
                'Add Renovate badge to your projects README: ',
                '[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com/)'
            )
        }

        if (this.answers.circleCI) {
            this.log(
                'Ensure you have the Circle CI command line tools installed for the pre-commit hook to function properly'
            )
        }

        if (this.answers.terraform) {
            this.log(
                'Ensure you have the Terraform command line tools installed for the pre-commit hook to function properly'
            )
        }
    }
}
