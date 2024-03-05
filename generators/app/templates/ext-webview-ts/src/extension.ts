// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

function getUri(webview: vscode.Webview, extensionUri: vscode.Uri, pathList: string[]) {
  return webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, ...pathList));
}
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "<%= name %>" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand('<%= name %>.helloWorld', () => {
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user
    vscode.window.showInformationMessage('Hello World from <%= displayName %>!');
  });

  context.subscriptions.push(disposable);

  context.subscriptions.push(vscode.window.registerWebviewViewProvider(
    'helloView_one',
    {
      resolveWebviewView(webviewView: vscode.WebviewView) {
        // 配置 WebviewView 的选项
        webviewView.webview.options = {
          enableScripts: true,
          localResourceRoots: [context.extensionUri]
        };
        // The CSS file from the React build output
        const stylesUri = getUri(webviewView.webview, context.extensionUri, ["webview", "build", "assets", "index.css"]);
        // The JS file from the React build output
        const scriptUri = getUri(webviewView.webview, context.extensionUri, ["webview", "build", "assets", "index.js"]);

        console.log(stylesUri, scriptUri);
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
export function deactivate() { }
