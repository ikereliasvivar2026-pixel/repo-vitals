import { hasAnyPath } from '../utils.js';
import type { Check } from '../types.js';

const CANDIDATES = ['SECURITY.md', 'docs/SECURITY.md', '.github/SECURITY.md'];

/**
 * Encourages a documented vulnerability-disclosure policy.
 *
 * GitHub uses SECURITY.md to populate the "Report a vulnerability" link on
 * the repo, which is the lowest-friction way to receive disclosures.
 */
export const securityPresent: Check = {
  id: 'security-present',
  title: 'SECURITY policy present',
  category: 'security',
  severity: 'warning',
  weight: 3,
  fixable: true,
  run(ctx) {
    if (hasAnyPath(ctx.files, CANDIDATES)) {
      return { status: 'pass', earned: 3, message: 'SECURITY policy found' };
    }
    return {
      status: 'fail',
      earned: 0,
      message: 'No SECURITY policy found',
      fixSuggestions: [
        'Add a SECURITY.md describing how to report vulnerabilities.',
        'Run `npx repo-vitals --fix` to scaffold a starter SECURITY.md.',
      ],
      fixable: true,
    };
  },
};
