import type { Check } from '../types.js';

/**
 * Verifies the project's package metadata has a description.
 *
 * Empty descriptions hurt discoverability on registries and on the GitHub
 * homepage UI.
 */
export const packageDescription: Check = {
  id: 'package-description',
  title: 'Project description set',
  category: 'discoverability',
  severity: 'warning',
  weight: 2,
  run(ctx) {
    const pkg = ctx.packageJson;
    if (!pkg) {
      return {
        status: 'skip',
        earned: 0,
        message: 'No package.json — skipping description check',
      };
    }
    if (pkg.description && pkg.description.trim().length >= 20) {
      return { status: 'pass', earned: 2, message: 'Description present in package.json' };
    }
    return {
      status: 'fail',
      earned: 0,
      message: 'package.json description is missing or too short (< 20 chars)',
      fixSuggestions: [
        'Add a `description` field to package.json with at least 20 characters.',
        'A great description sells the project in a single sentence — what does it do, for whom?',
      ],
    };
  },
};

/**
 * Encourages adding `keywords` to package.json (or repo topics on GitHub),
 * which is the primary SEO mechanism on npm and the GitHub explore pages.
 */
export const packageKeywords: Check = {
  id: 'package-keywords',
  title: 'Keywords / topics set',
  category: 'discoverability',
  severity: 'info',
  weight: 2,
  run(ctx) {
    const pkg = ctx.packageJson;
    if (!pkg) {
      return { status: 'skip', earned: 0, message: 'No package.json — skipping keywords check' };
    }
    const count = pkg.keywords?.length ?? 0;
    if (count >= 5) {
      return { status: 'pass', earned: 2, message: `${count} keywords set` };
    }
    if (count > 0) {
      return {
        status: 'warn',
        earned: 1,
        message: `Only ${count} keywords (recommend ≥ 5)`,
        fixSuggestions: ['Add more `keywords` to package.json to improve discoverability on npm.'],
      };
    }
    return {
      status: 'fail',
      earned: 0,
      message: 'No keywords set in package.json',
      fixSuggestions: [
        'Add a `keywords` array to package.json (5+ relevant terms).',
        'On GitHub, also add topics via repo settings — they power the Explore page.',
      ],
    };
  },
};

/**
 * Verifies the package has a homepage / repository link configured.
 */
export const packageHomepage: Check = {
  id: 'package-homepage',
  title: 'Homepage / repository link set',
  category: 'discoverability',
  severity: 'info',
  weight: 1,
  run(ctx) {
    const pkg = ctx.packageJson;
    if (!pkg) {
      return { status: 'skip', earned: 0, message: 'No package.json — skipping' };
    }
    if (pkg.homepage || pkg.repository) {
      return { status: 'pass', earned: 1, message: 'Homepage / repository link present' };
    }
    return {
      status: 'warn',
      earned: 0,
      message: 'No `homepage` or `repository` in package.json',
      fixSuggestions: ['Add a `repository` field to package.json so users can find the source.'],
    };
  },
};
