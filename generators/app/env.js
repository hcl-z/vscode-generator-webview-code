import request from 'request-light';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import Generator from 'yeoman-generator';

const fallbackVersion = '^1.54.0';
let versionPromise = undefined;

export function getLatestVSCodeVersion(count) {
    if (!versionPromise) {
        versionPromise = request.xhr({ url: 'https://update.code.visualstudio.com/api/releases/stable', headers: { "X-API-Version": "2" } }).then(res => {
            if (res.status === 200) {
                try {
                    let tagsAndCommits = JSON.parse(res.responseText);
                    if (Array.isArray(tagsAndCommits) && tagsAndCommits.length > 0) {
                        return [...new Set(tagsAndCommits.map(item => {
                            let segments = item.version.split('.');
                            if (segments.length === 3) {
                                return '^' + segments[0] + '.' + segments[1] + '.0';
                            }
                        }))].slice(0, count)
                    }
                } catch (e) {
                    console.log('Problem parsing version: ' + res.responseText, e);
                }
            } else {
                console.warn('Unable to evaluate the latest vscode version: Status code: ' + res.status + ', ' + res.responseText);
            }
            console.warn('Falling back to: ' + fallbackVersion);
            return fallbackVersion;
        }, err => {
            console.warn('Unable to evaluate the latest vscode version: Error: ', err);
            console.warn('Falling back to: ' + fallbackVersion);
            return fallbackVersion;
        });
    }
    return versionPromise;
};

export async function getDependencyVersions(dep) {
    const currentFileName = fileURLToPath(import.meta.url);
    const versions = JSON.parse((await fs.promises.readFile(path.join(currentFileName, '..', 'dependencyVersions', 'package.json'))).toString()).dependencies;
    return { ...versions, ...dep };
}


/**
 * @param {Generator} context\
 * @param {Object} extensionConfig
 */
export function getLocalVersion(context, extensionConfig) {
    const command = context.spawnCommand('code', ['--version'], {
        stdio: ['ignore', 'pipe', 'pipe'] // 'ignore' 表示忽略输入，'pipe' 表示捕获输出和错误
    });

    let output = '';

    command.stdout.on('data', (data) => {
        output += data.toString();
    });

    command.on('close', (code) => {
        if (code === 0 && output) {
            let outputArr = output.split('\n')
            let segments = outputArr[0].split('.');
            if (segments.length === 3) {
                extensionConfig.localVersion = '^' + segments[0] + '.' + segments[1] + '.0';
            }

        }
    });
}
