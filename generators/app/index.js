'use strict';

import Generator from 'yeoman-generator';
import yosay from 'yosay';
import * as path from 'path';
import * as env from './env.js';
import which from 'which';
import webviewjs from './generate-webview-js.js';
import webviewts from './generate-webview-ts.js';
import { copyTemplate } from './copy.js';
import { askForExtensionDescription, askForExtensionDisplayName, askForExtensionId, askForVscodeUI, askForVscodeVersion, askForWebviewTemplate } from './prompts.js';
import { read, readSync } from 'fs';
import * as fs from 'fs';
const extensionGenerators = [
    webviewjs, webviewts
]


export default class extends Generator {

    constructor(args, opts) {
        super(args, opts);
        this.description = 'Generates a Visual Studio Code extension ready for development.';

        this.argument('destination', { type: String, required: false, description: `\n    The folder to create the extension in, absolute or relative to the current working directory.\n    Use '.' for the current folder. If not provided, defaults to a folder with the extension display name.\n  ` })

        this.option('insiders', { type: Boolean, alias: 'i', description: 'Show the insiders options for the generator' });
        this.option('quick', { type: Boolean, alias: 'q', description: 'Quick mode, skip all optional prompts and use defaults' });
        this.option('open', { type: Boolean, alias: 'o', description: 'Open the generated extension in Visual Studio Code' });
        this.option('openInInsiders', { type: Boolean, alias: 'O', description: 'Open the generated extension in Visual Studio Code Insiders' });

        this.option('extensionDisplayName', { type: String, alias: 'n', description: 'Display name of the extension' });
        this.option('extensionId', { type: String, description: 'Id of the extension' });
        this.option('extensionDescription', { type: String, description: 'Description of the extension' });

        this.option('pkgManager', { type: String, description: `'npm', 'yarn' or 'pnpm'` });
        this.option('webpack', { type: Boolean, description: `Bundle the extension with webpack` });
        this.option('gitInit', { type: Boolean, description: `Initialize a git repo` });

        this.option('snippetFolder', { type: String, description: `Snippet folder location` });
        this.option('snippetLanguage', { type: String, description: `Snippet language` });

        this.extensionConfig = Object.create(null);
        this.extensionConfig.installDependencies = false;
        this.extensionConfig.insiders = false;

        this.extensionGenerator = undefined;

        this.abort = false;
    }

    async initializing() {
        if (this.options['insiders']) {
            this.extensionConfig.insiders = true;
        }

        env.getLocalVersion(this, this.extensionConfig)
        // Welcome
        if (!this.extensionConfig.insiders) {
            this.log(yosay('Welcome to the Visual Studio Code Extension generator!'));
        } else {
            this.log(yosay('Welcome to the Visual Studio Code Insiders Extension generator!'));
        }

        const destination = this.options['destination'];
        if (destination) {
            const folderPath = path.resolve(this.destinationPath(), destination);
            this.destinationRoot(folderPath);
        }
    }

    async prompting() {
        const choices = [];
        for (const g of extensionGenerators) {
            const name = this.extensionConfig.insiders ? g.insidersName : g.name;
            if (name) {
                choices.push({ name, value: g.id })
            }
        }
        this.extensionConfig.type = (await this.prompt({
            type: 'list',
            name: 'type',
            message: 'What type of extension do you want to create?',
            pageSize: choices.length,
            choices,
        })).type;


        this.extensionGenerator = extensionGenerators.find(g => g.id === this.extensionConfig.type);
        try {
            await askForVscodeVersion(this, this.extensionConfig);
            await askForExtensionDisplayName(this, this.extensionConfig);
            await askForExtensionId(this, this.extensionConfig);
            await askForExtensionDescription(this, this.extensionConfig);
            await askForWebviewTemplate(this, this.extensionConfig);
            await askForVscodeUI(this, this.extensionConfig);
            await this.extensionGenerator.prompt(this, this.extensionConfig);
        } catch (e) {
            console.log(e);
            this.abort = true;
        }
        // evaluateVersion
        const dependencyVersions = await env.getDependencyVersions({ '@types/vscode': this.extensionConfig.version });
        this.extensionConfig.dependencyVersions = dependencyVersions;
        this.extensionConfig.dep = function (name) {
            const version = dependencyVersions[name];
            if (typeof version === 'undefined') {
                throw new Error(`Module ${name} is not listed in env.js`);
            }
            return `${JSON.stringify(name)}: ${JSON.stringify(version)}`;
        };
    }
    // Write files
    async writing() {
        if (this.abort) {
            return;
        }
        if (!this.options['destination'] && !this.extensionGenerator.update) {
            this.destinationRoot(this.destinationPath(this.extensionConfig.name))
        }
        this.env.cwd = this.destinationPath();

        this.log();
        this.log(`Writing in ${this.destinationPath()}...`);

        const webviewPath = `frontEnd/template-${this.extensionConfig.template}${this.extensionGenerator.type === 'ts' ? '-ts' : ''}`
        const vscodePath = this.extensionConfig.type

        const writeConfig = this.extensionGenerator.getWriteConfig(this.extensionConfig);

        let webviewPkg = this.templatePath(`${webviewPath}/package.json`)
        const pkg = JSON.parse((await fs.promises.readFile(webviewPkg)).toString())
        this.extensionConfig.webviewPkg = pkg

        copyTemplate(this, this.extensionConfig, vscodePath, '', writeConfig)
        copyTemplate(this, this.extensionConfig, webviewPath, 'webview', { copyRoot: true, exclude: ['package.json'] })

        this.packageJson.merge({
            devDependencies: this.extensionConfig.webviewPkg.devDependencies,
            dependencies: this.extensionConfig.webviewPkg.dependencies
        })
        return;
    }

    // Installation
    async install() {
        if (this.abort) {
            // @ts-ignore
            this.env.options.skipInstall = true;
            return;
        }
        if (this.extensionConfig.installDependencies) {
            // @ts-ignore
            this.env.options.nodePackageManager = this.extensionConfig.pkgManager;
        } else {
            // @ts-ignore
            this.env.options.skipInstall = true;
        }
    }

    // End
    async end() {
        if (this.abort) {
            return;
        }

        if (this.extensionGenerator.update) {
            this.log('');
            this.log('Your extension has been updated!');
            this.log('');
            this.log('To start editing with Visual Studio Code, use the following commands:');
            this.log('');
            if (!this.extensionConfig.insiders) {
                this.log('     code .');
            } else {
                this.log('     code-insiders .');
            }
            this.log(`     ${this.extensionConfig.pkgManager} run compile-web`);
            this.log('');
            return;
        }

        // Git init
        if (this.extensionConfig.gitInit) {
            await this.spawn('git', ['init', '--quiet']);
        }

        if (this.extensionConfig.proposedAPI) {
            await this.spawn(this.extensionConfig.pkgManager, ['run', 'update-proposed-api']);
        }
        this.log('');

        this.log('Your extension ' + this.extensionConfig.name + ' has been created!');
        this.log('');

        const [codeStableLocation, codeInsidersLocation] = await Promise.all([which('code').catch(() => undefined), which('code-insiders').catch(() => undefined)]);

        if (!this.extensionConfig.insiders && !this.options['open'] && !this.options['openInInsiders'] && !this.options['quick']) {
            const cdLocation = this.options['destination'] || this.extensionConfig.name;

            this.log('To start editing with Visual Studio Code, use the following commands:');
            this.log('');
            if (!this.extensionConfig.insiders) {
                this.log('     code ' + cdLocation);
            } else {
                this.log('     code-insiders ' + cdLocation);
            }
            this.log('');
        }
        this.log('Open vsc-extension-quickstart.md inside the new extension for further instructions');
        this.log('on how to modify, test and publish your extension.');
        this.log('');

        if (this.extensionGenerator.endMessage) {
            this.extensionGenerator.endMessage(this, this.extensionConfig);
        }

        this.log('For more information, also visit http://code.visualstudio.com and follow us @code.');
        this.log('\r\n');

        if (this.options["open"]) {
            if (codeStableLocation) {
                this.log(`Opening ${this.destinationPath()} in Visual Studio Code...`);
                await this.spawn(codeStableLocation, [this.destinationPath()]);
            } else {
                this.log(`'code' command not found.`);
            }
        } else if (this.options["openInInsiders"]) {
            if (codeInsidersLocation) {
                this.log(`Opening ${this.destinationPath()} with Visual Studio Code Insiders...`);
                await this.spawn(codeInsidersLocation, [this.destinationPath()]);
            } else {
                this.log(`'code-insiders' command not found.`);
            }
        } else if (codeInsidersLocation || codeStableLocation) {
            if (this.options["quick"]) {
                await this.spawn(codeInsidersLocation || codeStableLocation, [this.destinationPath()]);
            } else {
                const choices = [];
                if (codeInsidersLocation) {
                    choices.push({ name: "Open with `code-insiders`", value: codeInsidersLocation });
                }
                if (codeStableLocation) {
                    choices.push({ name: "Open with `code`", value: codeStableLocation });
                }
                choices.push({ name: "Skip", value: 'skip' });

                const answer = await this.prompt({
                    type: "list",
                    name: "openWith",
                    message: "Do you want to open the new folder with Visual Studio Code?",
                    choices
                });
                if (answer && answer.openWith && answer.openWith !== 'skip') {
                    await this.spawn(answer.openWith, [this.destinationPath()]);
                }
            }
        }
    }
}
