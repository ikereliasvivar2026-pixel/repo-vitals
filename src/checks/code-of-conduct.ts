import { hasAnyPath } from '../utils.js';
import type { Check } from '../types.js';

const CANDIDATES = [
  'CODE_OF_CONDUCT.md',
  'CODE_OF_CONDUCT',
  'docs/CODE_OF_CONDUCT.md',
  '.github/CODE_OF_CONDUCT.md',
];

/**
 * Encourages adoption of a Code of Conduct.
 *
 * The Contributor Covenant is the de-facto standard and is one paragraph long
 * to add, so the friction-to-value ratio for repos is very high.
 */
export const codeOfConductPresent: Check = {
  id: 'code-of-conduct-present',
  title: 'Code of Conduct present',
  category: 'community',
  severity: 'warning',
  weight: 3,
  fixable: true,
  run(ctx) {
    if (hasAnyPath(ctx.files, CANDIDATES)) {
      return { status: 'pass', earned: 3, message: 'Code of Conduct found' };
    }
    return {
      status: 'fail',
      earned: 0,
      message: 'No Code of Conduct found',
      fixSuggestions: [
        'Add a CODE_OF_CONDUCT.md — the Contributor Covenant is a great default.',
        'Run `npx repo-vitals --fix` to scaffold Contributor Covenant v2.1.',
      ],
      fixable: true,
    };
  },
};
