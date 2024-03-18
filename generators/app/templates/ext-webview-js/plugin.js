export const VscodePlugin = () => ({
    name: 'html-transform',
    config() {
        return {
            experimental: {
                renderBuiltUrl(filename, { hostType }) {
                    if (hostType !== 'html') {
                        return { runtime: `__getUrl(${JSON.stringify(filename)})` };
                    } else {
                        return `VSCODE_RUNTIME%${filename}%`;
                    }
                },
            },
        };
    },
    transformIndexHtml() {
        return [{
            tag: 'script',
            children: `
          /* HeadScript */
          `,
            injectTo: 'head'
        }, {
            tag: 'script',
            children: `
          /* PreScript */
          `,
            injectTo: 'head-prepend'
        }, {
            tag: 'script',
            children: `
          /* PreBodyScript */
          `,
            injectTo: 'body-prepend'
        }, {
            tag: 'script',
            children: `
          /* BodyScript */
          `,
            injectTo: 'body'
        }];
    },

});

