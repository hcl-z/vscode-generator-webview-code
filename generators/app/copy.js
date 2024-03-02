import Generator from 'yeoman-generator';

/**
 * @param {Generator} generator
 * @param {Object} extensionConfig
 * @param {String} from
 * @param {String} to
 * @param {Object} config
 * @param {Array.<string|{from: string, to: string}>} [config.path] - 路径配置数组
 * @param {Array.<string|{from: string, to: string}>} [config.templatePath] - 模板路径配置数组
 * @param {Array<string>} [config.exclude] - 要排除的文件或文件夹
 * @param {Boolean} [config.copyRoot]
 */
export const copyTemplate = (generator, extensionConfig, from, to, config) => {
    let curTemplatePath = generator.templatePath();
    let curDestinationPath = generator.destinationPath();
    generator.sourceRoot(generator.templatePath(from));
    generator.destinationRoot(generator.destinationPath(to))

    const { path = [], templatePath = [], copyRoot = false, exclude = [] } = config || {};

    if (copyRoot) {
        generator.copyTemplate(
            generator.templatePath(),
            generator.destinationPath()
        );
    }

    path.forEach((path) => {
        if (typeof path === 'string') {
            generator.copyTemplate(
                generator.templatePath(path),
                generator.destinationPath(path)
            );
        } else {
            generator.copyTemplate(
                generator.templatePath(path.from),
                generator.destinationPath(path.to)
            );
        }
    });

    templatePath.forEach((path) => {
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

    exclude.forEach((path) => {
        generator.fs.delete(generator.destinationPath(path));
    });

    generator.sourceRoot(curTemplatePath);
    generator.destinationRoot(curDestinationPath);

}
