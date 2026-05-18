import { hasFileUnder, hasAnyPath } from '../utils.js';
import type { Check } from '../types.js';

/**
 * Looks for at least one issue template under the conventional location.
 *
 * GitHub picks up files in `.github/ISSUE_TEMPLATE/` and offers them to users
 * filing new issues, which dramatically improves the quality of bug reports.
 */
export const issueTemplatesPresent: Check = {
  id: 'issue-templates-present',
  title: 'Issue templates configured',
  category: 'community',
  severity: 'info',
  weight: 3,
  fixable: true,
  run(ctx) {
    const hasDir = hasFileUnder(ctx.files, '.github/issue_template');
    const hasLegacy = hasAnyPath(ctx.files, [
      '.github/ISSUE_TEMPLATE.md',
      '.github/issue_template.md',
    ]);
    if (hasDir || hasLegacy) {
      return { status: 'pass', earned: 3, message: 'Issue templates configured' };
    }
    return {
      status: 'fail',
      earned: 0,
      message: 'No issue templates configured',
      fixSuggestions: [
        'Add issue templates under `.github/ISSUE_TEMPLATE/` (bug_report.yml, feature_request.yml).',
        'Run `npx repo-vitals --fix` to scaffold the standard templates.',
      ],
      fixable: true,
    };
  },
};

/**
 * Looks for a pull-request template at any of the supported locations.
 */
export const prTemplatePresent: Check = {
  id: 'pr-template-present',
  title: 'Pull request template configured',
  category: 'community',
  severity: 'info',
  weight: 2,
  fixable: true,
  run(ctx) {
    const has = hasAnyPath(ctx.files, [
      'PULL_REQUEST_TEMPLATE.md',
      '.github/PULL_REQUEST_TEMPLATE.md',
      '.github/pull_request_template.md',
      'docs/PULL_REQUEST_TEMPLATE.md',
    ]);
    if (has) {
      return { status: 'pass', earned: 2, message: 'PR template found' };
    }
    return {
      status: 'fail',
      earned: 0,
      message: 'No PR template found',
      fixSuggestions: [
        'Add `.github/PULL_REQUEST_TEMPLATE.md`.',
        'Run `npx repo-vitals --fix` to scaffold one for you.',
      ],
      fixable: true,
    };
  },
};
