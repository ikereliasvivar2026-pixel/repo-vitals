import { hasAnyPath, hasFileMatching, hasFileUnder, hasFileWithBasenamePattern } from '../utils.js';
import type { Check } from '../types.js';

const TEST_DIRS = ['test', 'tests', '__tests__', 'spec'];
const TEST_FILE_SUFFIXES = [
  '.test.js',
  '.test.jsx',
  '.test.ts',
  '.test.tsx',
  '.spec.js',
  '.spec.jsx',
  '.spec.ts',
  '.spec.tsx',
  '_test.go',
  '_spec.rb',
];
// Python tests use a prefix convention (`test_<name>.py`) which `endsWith` —
// our standard suffix matcher — cannot express, so we check it separately.
const TEST_FILE_BASENAME_PATTERNS: Array<{ prefix: string; ext: string }> = [
  { prefix: 'test_', ext: '.py' },
];

const TEST_RUNNER_DEPS = [
  'jest',
  'vitest',
  'mocha',
  'ava',
  'tap',
  'tape',
  'jasmine',
  'cypress',
  'playwright',
  '@playwright/test',
  '@testing-library/react',
];

/**
 * Detects either a tests directory, common test-file suffixes, or a known
 * test runner in dependencies.
 *
 * Any single signal is enough — repos use widely different conventions.
 */
export const testsDetected: Check = {
  id: 'tests-detected',
  title: 'Tests detected',
  category: 'quality',
  severity: 'error',
  weight: 8,
  run(ctx) {
    const hasTestDir = TEST_DIRS.some((d) => hasFileUnder(ctx.files, d));
    const hasTestFiles =
      TEST_FILE_SUFFIXES.some((s) => hasFileMatching(ctx.files, s)) ||
      TEST_FILE_BASENAME_PATTERNS.some((p) =>
        hasFileWithBasenamePattern(ctx.files, p.prefix, p.ext),
      );

    let foundRunner: string | null = null;
    if (ctx.packageJson) {
      const deps = {
        ...(ctx.packageJson.dependencies ?? {}),
        ...(ctx.packageJson.devDependencies ?? {}),
      };
      foundRunner = TEST_RUNNER_DEPS.find((d) => d in deps) ?? null;
    }

    if (hasTestDir || hasTestFiles || foundRunner) {
      const parts: string[] = [];
      if (foundRunner) parts.push(foundRunner);
      if (hasTestDir) parts.push('test directory');
      if (hasTestFiles && !hasTestDir) parts.push('test files');
      return {
        status: 'pass',
        earned: 8,
        message: `Tests detected (${parts.join(', ') || 'unknown runner'})`,
      };
    }

    return {
      status: 'fail',
      earned: 0,
      message: 'No tests detected',
      fixSuggestions: [
        'Add automated tests using your preferred runner (vitest, jest, pytest, go test, ...).',
        'Even a smoke test that imports the library catches a surprising number of regressions.',
      ],
    };
  },
};

/**
 * Looks for a linter or formatter configuration.
 *
 * Linters catch a huge fraction of trivial bugs without runtime checks, so
 * adoption is the cheapest win in code quality.
 */
export const linterConfigured: Check = {
  id: 'linter-configured',
  title: 'Linter configured',
  category: 'quality',
  severity: 'warning',
  weight: 3,
  run(ctx) {
    const has = hasAnyPath(ctx.files, [
      '.eslintrc',
      '.eslintrc.js',
      '.eslintrc.json',
      '.eslintrc.cjs',
      '.eslintrc.yaml',
      '.eslintrc.yml',
      'eslint.config.js',
      'eslint.config.mjs',
      'eslint.config.ts',
      '.flake8',
      'ruff.toml',
      '.ruff.toml',
      'pyproject.toml',
      'rubocop.yml',
      '.rubocop.yml',
      'clippy.toml',
      'rustfmt.toml',
      'biome.json',
      'biome.jsonc',
    ]);
    if (has) {
      return { status: 'pass', earned: 3, message: 'Linter / formatter config found' };
    }
    return {
      status: 'warn',
      earned: 0,
      message: 'No linter / formatter configuration detected',
      fixSuggestions: [
        'Add a linter for your stack (eslint, ruff, clippy, rubocop, ...).',
        'A formatter (prettier, black, gofmt) eliminates whole classes of review nits.',
      ],
    };
  },
};

/**
 * Encourages adoption of `.editorconfig` for consistent indentation across
 * editors and operating systems.
 */
export const editorconfigPresent: Check = {
  id: 'editorconfig-present',
  title: 'EditorConfig present',
  category: 'quality',
  severity: 'info',
  weight: 1,
  fixable: true,
  run(ctx) {
    if (hasAnyPath(ctx.files, ['.editorconfig'])) {
      return { status: 'pass', earned: 1, message: 'EditorConfig found' };
    }
    return {
      status: 'warn',
      earned: 0,
      message: 'No .editorconfig found',
      fixSuggestions: [
        'Add an `.editorconfig` so every editor uses the same indentation, charset and line endings.',
        'Run `npx repo-vitals --fix` to add a sensible default.',
      ],
      fixable: true,
    };
  },
};

/**
 * Verifies a `.gitignore` exists at the repo root.
 *
 * Missing one is the #1 source of accidentally-committed build artifacts and
 * `.env` files leaking into history.
 */
export const gitignorePresent: Check = {
  id: 'gitignore-present',
  title: '.gitignore present',
  category: 'quality',
  severity: 'warning',
  weight: 2,
  fixable: true,
  run(ctx) {
    if (hasAnyPath(ctx.files, ['.gitignore'])) {
      return { status: 'pass', earned: 2, message: '.gitignore found' };
    }
    return {
      status: 'fail',
      earned: 0,
      message: 'No .gitignore found',
      fixSuggestions: [
        'Add a `.gitignore` tailored to your stack (see https://gitignore.io).',
        'Run `npx repo-vitals --fix` to add a sensible default for the detected language.',
      ],
      fixable: true,
    };
  },
};

/**
 * Encourages a CHANGELOG to track user-facing changes between releases.
 */
export const changelogPresent: Check = {
  id: 'changelog-present',
  title: 'CHANGELOG present',
  category: 'documentation',
  severity: 'info',
  weight: 2,
  run(ctx) {
    if (hasAnyPath(ctx.files, ['CHANGELOG.md', 'CHANGELOG', 'CHANGES.md', 'HISTORY.md'])) {
      return { status: 'pass', earned: 2, message: 'CHANGELOG found' };
    }
    return {
      status: 'warn',
      earned: 0,
      message: 'No CHANGELOG found',
      fixSuggestions: [
        'Add a CHANGELOG.md following https://keepachangelog.com or use Conventional Commits + an automated release tool.',
      ],
    };
  },
};
