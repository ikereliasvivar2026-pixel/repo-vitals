import { hasAnyPath } from '../utils.js';
import type { Check } from '../types.js';

const CANDIDATES = [
  'CONTRIBUTING.md',
  'CONTRIBUTING',
  'CONTRIBUTING.rst',
  'docs/CONTRIBUTING.md',
  '.github/CONTRIBUTING.md',
];

/**
 * Verifies the repo provides clear contributor guidance.
 *
 * GitHub surfaces this file directly in the "New PR" UI, so missing it adds
 * friction for every drive-by contributor.
 */
export const contributingPresent: Check = {
  id: 'contributing-present',
  title: 'CONTRIBUTING file present',
  category: 'community',
  severity: 'warning',
  weight: 4,
  fixable: true,
  run(ctx) {
    if (hasAnyPath(ctx.files, CANDIDATES)) {
      return { status: 'pass', earned: 4, message: 'CONTRIBUTING guide found' };
    }
    return {
      status: 'fail',
      earned: 0,
      message: 'No CONTRIBUTING guide found',
      fixSuggestions: [
        'Add a CONTRIBUTING.md describing how to set up the project and propose changes.',
        'Run `npx repo-vitals --fix` to scaffold a starter CONTRIBUTING.md.',
      ],
      fixable: true,
    };
  },
};
