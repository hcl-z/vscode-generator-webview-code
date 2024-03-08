# Yo Webview Code - Extension and Customization Generator
[![npm Package](https://img.shields.io/npm/v/generator-webview-code.svg?style=flat-square)](https://www.npmjs.org/package/generator-webview-code)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This project is a yeoman generator to quickly create a vscode plugin template with webview functionality.

## Features
✨ Fast template creation without manual configuration

✨ Common front-end template support, using vite as a build tool

✨ Automatic front-end resource path handling

✨ vscode Api injection & type support

## Install the Generator

Install Yeoman and the webview VS Code Extension generator:

```bash
npm install -g yo generator-webview-code
```

## Run Yo Code

The Yeoman generator will walk you through the steps required to create your customization or extension prompting for the required information.

To launch the generator simply type:

```bash
yo webview-code
```

## Local development

After making necessary changes, run `npm link` before running `yo code` to
test the local version.

You can learn more about Yeoman generator development on its
[documentation website](https://yeoman.io/authoring/index.html).

## License

[MIT](LICENSE)
