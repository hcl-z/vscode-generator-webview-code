import Generator from 'yeoman-generator';

/**
 * @param {Generator} generator
 * @param {Object} extensionConfig
 * @param {String} rootPath
 * @param {{path:Array<String|{from:String,to:String}>,templatePath:Array<String|{from:String,to:String}>}} config
 */
export const copyTemplate = (generator, extensionConfig, rootPath, config) => {
    generator.sourceRoot(rootPath);

    const { path, templatePath } = config;
    (path || []).forEach((path) => {
        if (typeof path === 'string') {
            generator.copyTemplate(
                generator.templatePath(path),
                generator.destinationPath(path),
                extensionConfig
            );
        } else {
            generator.copyTemplate(
                generator.templatePath(path.from),
                generator.destinationPath(path.to),
                extensionConfig
            );
        }
    });

    (templatePath || []).forEach((path) => {
        if (typeof path === 'string') {
            generator.fs.copyTpl(
                generator.templatePath(path),
                generator.destinationPath(path),
                extensionConfig
            );
        } else {
            generator.fs.copyTpl(
                generator.templatePath(path.from),
                generator.destinationPath(path.to),
                extensionConfig
            );
        }
    });

}
