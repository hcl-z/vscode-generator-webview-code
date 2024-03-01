import Generator from 'yeoman-generator';
import * as prompts from './prompts.js';

export default {
    id: 'ext-webview-js',
    aliases: ['js', 'webview-js'],
    name: 'New Webview Extension (JavaScript)',
    /**
     * @param {Object} extensionConfig
     */
    getWriteConfig: (extensionConfig) => {
        /**
         * @type {{path:Array<String|{from:String,to:String}>,templatePath:Array<String|{from:String,to:String}>}}
         */
        const config = {
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
        }
        if (extensionConfig) {
            config.templatePath.push({
                from: 'gitignore',
                to: '.gitignore'
            })
        }

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
        await prompts.askForExtensionDisplayName(generator, extensionConfig);
        await prompts.askForExtensionId(generator, extensionConfig);
        await prompts.askForExtensionDescription(generator, extensionConfig);
        await prompts.askForWebviewTemplate(generator, extensionConfig);
        await prompts.askForVscodeUI(generator, extensionConfig);
        extensionConfig.checkJavaScript = false;
        await generator.prompt({
            type: 'confirm',
            name: 'checkJavaScript',
            message: 'Enable JavaScript type checking in \'jsconfig.json\'?',
            default: false
        }).then(strictJavaScriptAnswer => {
            extensionConfig.checkJavaScript = strictJavaScriptAnswer.checkJavaScript;
        });

        await prompts.askForGit(generator, extensionConfig);
        await prompts.askForPackageManager(generator, extensionConfig);
    },

    /**
     * @param {Generator&{webviewRoot:string}} generator
     * @param {Object} extensionConfig
     * @param {Object} pathConfig
     * @param {String} pathConfig.vscodePath
     * @param {String} pathConfig.templatePath
     */
    write: (generator, extensionConfig) => {

        extensionConfig.installDependencies = true;
    },

    /**
     * @param {Generator&{webviewRoot:string}} generator
     * @param {Object} extensionConfig
     * @param {Object} pathConfig
     * @param {String} pathConfig.vscodePath
     * @param {String} pathConfig.templatePath
    */
    process: (generator, extensionConfig) => {

    }
}
