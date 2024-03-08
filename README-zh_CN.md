# Yo Webview Code - vscode webview 插件脚手架
[![npm Package](https://img.shields.io/npm/v/generator-webview-code.svg?style=flat-square)](https://www.npmjs.org/package/generator-webview-code)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

本项目是一个yeoman generator，用于快速创建一个基于 webview 功能的 vscode 插件模版。

## 特点
:sparkles: 快速创建模版，无需手动配置

:sparkles: 常用前端模版支持，使用 vite 作为构建工具

:sparkles: 前端资源路径自动处理

:sparkles: vscode Api 注入 & 类型支持


## 安装


```bash
npm install -g yo generator-webview-code
```

## 运行

Yeoman 生成器将引导您完成创建自定义或扩展所需的步骤，并提示您所需的信息。

要运行生成器，只需在您选择的目录中运行以下命令：

```bash
yo webview-code
```

根据提示创建完项目后，进入项目目录，安装依赖：

```bash
cd my-extension
npm install
```

运行调试即可启动前端项目以及 vscode 插件，不出意外的话就可以在新打开的窗口看到新的插件了

## 本地调试

在运行 `yo code` 前运行 `npm link` 以测试本地版本。
测试本地版本。

有关 Yeoman 生成器开发的更多信息，请访问
[documentation website](https://yeoman.io/authoring/index.html).


## License

[MIT](LICENSE)
