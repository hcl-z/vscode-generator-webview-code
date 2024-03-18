type VSCode = {
  postMessage(msg:Record<string,any>): void;
  getState(): any;
  setState(state: any): void;
};

declare const vscode: VSCode;
