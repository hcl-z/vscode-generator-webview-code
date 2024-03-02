import Generator from 'yeoman-generator';
import { Chalk } from 'chalk';
import * as prompts from './prompts.js';

const chalk = new Chalk();

export default {
    id: 'ext-webview-ts',
    aliases: ['ts', 'webview-ts'],
    name: 'New Webview Extension (TypeScript)',
    insidersName: 'New Extension with Proposed API (TypeScript)',
    type: 'ts',
    getWriteConfig: (extensionConfig) => {
        /**
         * @type {Object} config
         * @param {Array.<string|{from: string, to: string}>} [config.path] - 路径配置数组
         * @param {Array.<string|{from: string, to: string}>} [config.templatePath] - 模板路径配置数组
         * @param {Array<string>} [config.exclude] - 要排除的文件或文件夹
         * @param {Boolean} [config.copyRoot]
         */

        const config = extensionConfig.webpack ? {
            path: [
                'vscode',
                'test',
                '.vscodeignore',
                'CHANGELOG.md',
                'vsc-extension-quickstart.md',
                'jsconfig.json',
                'extension.js',
                '.eslintrc.json',
            ],
            templatePath: [
                'README.md',
                'CHANGELOG.md',
                'package.json',
                'jsconfig.json'
            ]
        } : {
            path: [{ from: 'vscode-webpack/vscode', to: 'vscode' }],
            templatePath: [
                { from: 'vscode-webpack/package.json', to: 'package.json' },
                { from: 'vscode-webpack/tsconfig.json', to: 'tsconfig.json' },
                { from: 'vscode-webpack/.vscodeignore', to: '.vscodeignore' },
                { from: 'vscode-webpack/webpack.config.js', to: 'webpack.config.ts' },
                { from: 'vscode-webpack/vsc-extension-quickstart.md', to: 'vsc-extension-quickstart.md' }
            ]
        }

        if (extensionConfig) {
            config.templatePath.push({
                from: 'gitignore',
                to: '.gitignore'
            })
        }

        config.path.push(...['src/test', '.vscode-test.mjs', '.eslintrc.json']);
        config.templatePath.push(...['README.md', 'CHANGELOG.md', 'src/extension.ts']);

        if (extensionConfig.pkgManager === 'yarn') {
            config.path.push('.yarnrc');
        } else if (extensionConfig.pkgManager === 'pnpm') {
            config.path.push({
                from: '.npmrc-pnpm',
                to: '.npmrc'
            })
        }
        return config;
    },
    /**
     * @param {Generator} generator
     * @param {Object} extensionConfig
     */
    prompt: async (generator, extensionConfig) => {
        await prompts.askForGit(generator, extensionConfig);
        await prompts.askForWebpack(generator, extensionConfig);
        await prompts.askForPackageManager(generator, extensionConfig);
    },
    /**
     * @param {Generator} generator
     * @param {Object} extensionConfig
     */
    write: (generator, extensionConfig) => {
        extensionConfig.installDependencies = true;
        extensionConfig.proposedAPI = extensionConfig.insiders;
    },

    /**
     * @param {Generator} generator
     * @param {Object} extensionConfig
     */
    endMessage: (generator, extensionConfig) => {
        if (extensionConfig.webpack) {
            generator.log(chalk.yellow(`To run the extension you need to install the recommended extension 'amodio.tsl-problem-matcher'.`));
            generator.log('');
        }
    }
}
