/*!
 * @copyright FLYACTS GmbH 2018
 */

import * as archiver from 'archiver';
import getStdin = require('get-stdin');

import logger from './logger';

interface GitFile {
    isBinary: boolean;
    name: string;
    content: string;
}

const storeFiles = [
    'mimetype',
    'preview.png',
    'thumbnail.png',
    'metadata.xml',
];

/**
 * Convert the zip file into a format that git can understand
 */
export async function smudge() {
    logger.debug('Starting Smudge');

    const archive = archiver('zip', {
        zlib: {
            level: 9,
        },
    });

    archive.pipe(process.stdout);

    const content = JSON.parse(await getStdin()) as GitFile[];

    for (const file of content) {
        logger.debug(`processing ${file.name} isBinary: ${file.isBinary ? 'True' : 'False'}`);
        if (file.isBinary) {
            archive.append(Buffer.from(file.content, 'base64'), {
                name: file.name,
                store: true,
            });
        } else {
            let plainContent = file.content;
            try {
                plainContent = JSON.parse(plainContent);
                plainContent = JSON.stringify(plainContent);
            } catch (error) {}
            archive.append(plainContent, {
                name: file.name,
                store: storeFiles.includes(file.name),
            });
        }
    }

    archive.finalize();
}
