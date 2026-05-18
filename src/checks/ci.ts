import { hasFileUnder, hasAnyPath } from '../utils.js';
import type { Check } from '../types.js';

const CI_PATHS_BY_PROVIDER: Array<{ provider: string; check: (files: Set<string>) => boolean }> = [
  {
    provider: 'GitHub Actions',
    check: (f) => hasFileUnder(f, '.github/workflows'),
  },
  {
    provider: 'CircleCI',
    check: (f) => hasAnyPath(f, ['.circleci/config.yml']),
  },
  {
    provider: 'GitLab CI',
    check: (f) => hasAnyPath(f, ['.gitlab-ci.yml']),
  },
  {
    provider: 'Travis CI',
    check: (f) => hasAnyPath(f, ['.travis.yml']),
  },
  {
    provider: 'Azure Pipelines',
    check: (f) => hasAnyPath(f, ['azure-pipelines.yml']),
  },
  {
    provider: 'Jenkins',
    check: (f) => hasAnyPath(f, ['Jenkinsfile']),
  },
];

/**
 * Detects any popular CI provider configuration.
 *
 * A repo without automated checks ships unverified code, so this is weighted
 * heavily despite being technically optional.
 */
export const ciConfigured: Check = {
  id: 'ci-configured',
  title: 'CI configured',
  category: 'ci',
  severity: 'error',
  weight: 8,
  run(ctx) {
    for (const { provider, check } of CI_PATHS_BY_PROVIDER) {
      if (check(ctx.files)) {
        return { status: 'pass', earned: 8, message: `${provider} detected` };
      }
    }
    return {
      status: 'fail',
      earned: 0,
      message: 'No CI configuration detected',
      fixSuggestions: [
        'Add a GitHub Actions workflow under `.github/workflows/ci.yml`.',
        'A starter CI matrix is included when you scaffold a repo with `repo-vitals --fix`.',
      ],
    };
  },
};

/**
 * Encourages automated dependency updates via Dependabot or Renovate.
 */
export const dependabotConfigured: Check = {
  id: 'dependabot-configured',
  title: 'Automated dependency updates configured',
  category: 'ci',
  severity: 'warning',
  weight: 3,
  fixable: true,
  run(ctx) {
    const dependabot = hasAnyPath(ctx.files, ['.github/dependabot.yml', '.github/dependabot.yaml']);
    const renovate = hasAnyPath(ctx.files, [
      'renovate.json',
      '.github/renovate.json',
      '.renovaterc',
      '.renovaterc.json',
    ]);
    if (dependabot || renovate) {
      const tool = dependabot ? 'Dependabot' : 'Renovate';
      return { status: 'pass', earned: 3, message: `${tool} configured` };
    }
    return {
      status: 'fail',
      earned: 0,
      message: 'No automated dependency updates (Dependabot / Renovate) configured',
      fixSuggestions: [
        'Add `.github/dependabot.yml` to keep dependencies up to date.',
        'Run `npx repo-vitals --fix` to scaffold a Dependabot config.',
      ],
      fixable: true,
    };
  },
};
