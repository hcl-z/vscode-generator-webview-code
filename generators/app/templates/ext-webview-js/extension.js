// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const { readFileSync } = require('fs')
function getUri(webview, extensionUri, pathList) {
    return webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, ...pathList));
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "<%= name %>" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('<%= name %>.helloWorld', function () {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World from <%= displayName %>!');
    });

    context.subscriptions.push(disposable);

    context.subscriptions.push(vscode.window.registerWebviewViewProvider(
        'helloView_one',
        {
            resolveWebviewView(webviewView) {
                // 配置 WebviewView 的选项
                webviewView.webview.options = {
                    enableScripts: true,
                    localResourceRoots: [context.extensionUri]
                };
                const baseUri = getUri(webviewView.webview, context.extensionUri, ["webview", "dist"]);
                const htmlUri = getUri(webviewView.webview, context.extensionUri, ["webview", "dist", "index.html"]);

                // replace js and css path
                const htmlContent = readFileSync(htmlUri.fsPath, 'utf-8').replace(/VSCODE_RUNTIME%(.*)%/g, `${baseUri}/$1`);

                // Tip: Install the es6-string-html VS Code extension to enable code highlighting below
                webviewView.webview.html = htmlContent.replace('/* PreScript */', `
                    const __getUrl=(url)=>{
                        return '${baseUri}'+'/'+url
                    }
                    const vscode = acquireVsCodeApi();
                `);
            }
        }
    ));
}

// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
    activate,
    deactivate
}
