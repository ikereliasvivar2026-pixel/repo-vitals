import path from 'node:path';
import { readFileSafe } from '../utils.js';
import type { Check } from '../types.js';

const LICENSE_CANDIDATES = [
  'LICENSE',
  'LICENSE.md',
  'LICENSE.txt',
  'LICENSE.MIT',
  'license',
  'license.md',
  'COPYING',
  'COPYING.md',
];

const KNOWN_LICENSES: Array<{ name: string; pattern: RegExp }> = [
  { name: 'MIT', pattern: /\bMIT License\b|\bPermission is hereby granted, free of charge\b/i },
  { name: 'Apache-2.0', pattern: /\bApache License\b.*\bVersion 2\.0\b/is },
  { name: 'GPL-3.0', pattern: /\bGNU GENERAL PUBLIC LICENSE\b.*\bVersion 3\b/is },
  { name: 'GPL-2.0', pattern: /\bGNU GENERAL PUBLIC LICENSE\b.*\bVersion 2\b/is },
  { name: 'BSD-3-Clause', pattern: /\bRedistribution and use\b.*\bneither the name\b/is },
  { name: 'BSD-2-Clause', pattern: /\bRedistribution and use\b.*\bThis software is provided\b/is },
  { name: 'ISC', pattern: /\bISC License\b/i },
  { name: 'MPL-2.0', pattern: /\bMozilla Public License\b.*\bVersion 2\.0\b/is },
  {
    name: 'Unlicense',
    pattern: /\bThis is free and unencumbered software released into the public domain\b/i,
  },
];

/**
 * Verifies the repo ships with a recognizable LICENSE file.
 *
 * Without a license, the code is "all rights reserved" by default — making it
 * legally unusable. This is non-negotiable, hence the high weight.
 */
export const licensePresent: Check = {
  id: 'license-present',
  title: 'LICENSE file present',
  category: 'community',
  severity: 'error',
  weight: 8,
  fixable: true,
  async run(ctx) {
    for (const candidate of LICENSE_CANDIDATES) {
      const content = await readFileSafe(path.join(ctx.repoPath, candidate));
      if (content) {
        const detected = KNOWN_LICENSES.find((l) => l.pattern.test(content))?.name;
        return {
          status: 'pass',
          earned: 8,
          message: detected
            ? `Found ${candidate} (${detected})`
            : `Found ${candidate} (unrecognized license)`,
        };
      }
    }
    return {
      status: 'fail',
      earned: 0,
      message: 'No LICENSE file found',
      fixSuggestions: [
        'Choose a license at https://choosealicense.com and add a LICENSE file.',
        'Run `npx repo-vitals --fix` to add an MIT LICENSE for you.',
      ],
      fixable: true,
    };
  },
};
