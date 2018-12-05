/*!
 * @copyright FLYACTS GmbH 2018
 */

import * as ft from 'file-type';
import { buffer } from 'get-stdin';
import * as JSZip from 'jszip';

const isBinaryFile = require('isbinaryfile');

import logger from './logger';

interface GitFile {
    isBinary: boolean;
    name: string;
    content: string;
}

/**
 * Convert the git blob to a file on the filesystem
 */
export async function clean() {
    logger.debug('Starting clean');

    const input = await buffer();
    const results = ft(input) as (ft.FileTypeResult | null);
    if (results === null)  {
        logger.debug('Could not determin mime type, skipping');
        return;
    }

    if (results.mime !== 'application/zip') {
        logger.debug(`Got ${results.mime} but wanted application/zip, skipping`);
    }

    logger.debug('Got a zip file, lets go to action');
    const zip = new JSZip();

    await zip.loadAsync(input);

    const files: GitFile[] = [];

    for (const fileName of Object.keys(zip.files)) {
        logger.debug(`Working on ${fileName}`);
        const file = zip.files[fileName];
        const content = await file.async('nodebuffer');
        const isBinary = isBinaryFile.sync(content, content.length);
        if (!isBinary) {
            let textContent = content.toString();
            try {
                textContent = JSON.parse(textContent);
            } catch (error) {
                // failed to parse json
            }
            files.push({
                name: fileName,
                content: textContent,
                isBinary: false,
            });
        } else {
            const encodingSafeContent = content.toString('base64');
            files.push({
                name: fileName,
                content: encodingSafeContent,
                isBinary: true,
            });
        }
    }

    process.stdout.write(JSON.stringify(files, undefined, 4));
}
