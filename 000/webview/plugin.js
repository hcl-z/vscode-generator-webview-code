// myCustomPlugin.js

export default function myCustomPlugin() {
    return {
        name: 'my-custom-plugin',
        transform(src, id) {
            console.log(id, src)
            // if (id.endsWith('.svg')) {
            //     // 在这里进行资源路径转换的逻辑
            //     return {
            //         code: `<%=${src} &>`, // 将资源路径转换成 ${path} 格式
            //         map: null,
            //     };
            // }
        },
    };
}
