// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

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
                // The CSS file from the React build output
                const stylesUri = getUri(webviewView.webview, this.context.extensionUri, ["webview", "build", "assets", "index.css"]);
                // The JS file from the React build output
                const scriptUri = getUri(webviewView.webview, this.context.extensionUri, ["webview", "build", "assets", "index.js"]);
                // Tip: Install the es6-string-html VS Code extension to enable code highlighting below
                webviewView.webview.html = `
                    <!DOCTYPE html>
                    <html lang="en">
                        <head>
                        <meta charset="UTF-8" />
                        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                        <link rel="stylesheet" type="text/css" href="${stylesUri}">
                        <script type="module" src="${scriptUri}"></script>
                        <script>
                        const vscode = acquireVsCodeApi();
                    </script>
                        <title>Hello World</title>
                        </head>
                        <body>
                        <div id="root"></div>
                        </body>
                    </html>
                    `;
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
