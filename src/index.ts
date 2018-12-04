/*!
 * @copyright FLYACTS GmbH 2018
 */

import * as minimist from 'minimist';

import { clean } from './clean';
import logger from './logger';
import { smudge } from './smudge';

export async function main() {
    logger.debug('starting filter');
    const argv = minimist(process.argv.slice(2));
    if (argv.debug === true) {
        logger.level = 'debug';
    }
    if (argv.smudge === true) {
        await smudge();
    } else if (argv.clean === true) {
        await clean();
    } else {
        throw new Error('Invalid Arguments');
    }
}

// tslint:disable-next-line
(async function() {
    try {
        await main();
    } catch (error) {
        logger.error(`Uncatched error: ${error.message}`);
        process.exit(-1);
    }
})();
