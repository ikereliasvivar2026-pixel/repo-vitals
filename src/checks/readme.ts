import type { Check } from '../types.js';

/**
 * Reports that a README exists in any of the common formats.
 *
 * A README is the single most important signal of a usable open-source repo,
 * so this check carries a high weight relative to the rest.
 */
export const readmePresent: Check = {
  id: 'readme-present',
  title: 'README file present',
  category: 'community',
  severity: 'error',
  weight: 10,
  fixable: true,
  run(ctx) {
    if (ctx.readme !== null) {
      return {
        status: 'pass',
        earned: 10,
        message: `Found ${ctx.readmeFile}`,
      };
    }
    return {
      status: 'fail',
      earned: 0,
      message: 'No README found',
      fixSuggestions: [
        'Add a README.md at the repo root.',
        'Run `npx repo-vitals --fix` to scaffold one for you.',
      ],
      fixable: true,
    };
  },
};

// Headings are matched on a "line starts with #s, then any decoration (emoji,
// punctuation), then the keyword" basis so emoji-prefixed headings still count.
const SECTION_PATTERNS: Array<{ key: string; label: string; pattern: RegExp; points: number }> = [
  {
    key: 'install',
    label: 'an install/usage section',
    pattern: /^\s*#+[^\n]*\b(install(ation)?|getting started|quick ?start|usage)\b/im,
    points: 2,
  },
  {
    key: 'examples',
    label: 'examples',
    pattern: /^\s*#+[^\n]*\b(example|usage|features)\b/im,
    points: 2,
  },
  {
    key: 'license',
    label: 'a license section or link',
    pattern: /^\s*#+[^\n]*\blicen[sc]e\b|\blicen[sc]e\s*[:\]]|\[licen[sc]e\]/im,
    points: 1,
  },
  {
    key: 'contributing',
    label: 'a contributing section or link',
    pattern: /^\s*#+[^\n]*\bcontribut(ing|e)\b|\[contribut(ing|e)\]|contribut(ing|e)\.md/im,
    points: 1,
  },
];

/**
 * Scores README structure based on common sections.
 *
 * The thresholds are intentionally generous — we want to reward repos that
 * make an honest attempt rather than punish stylistic differences.
 */
export const readmeQuality: Check = {
  id: 'readme-quality',
  title: 'README has key sections',
  category: 'documentation',
  severity: 'warning',
  weight: 6,
  run(ctx) {
    if (!ctx.readme) {
      return {
        status: 'skip',
        earned: 0,
        message: 'No README to evaluate',
      };
    }
    const readme = ctx.readme;
    const missing: string[] = [];
    let earned = 0;
    for (const { label, pattern, points } of SECTION_PATTERNS) {
      if (pattern.test(readme)) {
        earned += points;
      } else {
        missing.push(label);
      }
    }
    if (missing.length === 0) {
      return {
        status: 'pass',
        earned,
        message: 'README includes install, examples, license and contributing sections',
      };
    }
    return {
      status: earned >= 4 ? 'warn' : 'fail',
      earned,
      message: `README missing ${missing.join(', ')}`,
      fixSuggestions: missing.map((m) => `Add ${m} to the README.`),
    };
  },
};

/**
 * Looks for at least one shields.io / img.shields.io style badge in the README.
 *
 * Repos with badges are read as more professional and almost universally rank
 * higher in casual review.
 */
export const readmeBadges: Check = {
  id: 'readme-badges',
  title: 'README has badges',
  category: 'documentation',
  severity: 'info',
  weight: 2,
  run(ctx) {
    if (!ctx.readme) {
      return { status: 'skip', earned: 0, message: 'No README to evaluate' };
    }
    const has = /(img\.shields\.io|badge\.fury\.io|codecov\.io\/.+\/branch)/i.test(ctx.readme);
    if (has) {
      return { status: 'pass', earned: 2, message: 'README includes status badges' };
    }
    return {
      status: 'warn',
      earned: 0,
      message: 'README has no status badges',
      fixSuggestions: [
        'Add CI, license, and version badges via https://shields.io.',
        'A `Repo Vitals` badge is a great fit: `![Repo Vitals](https://repo-vitals.dev/badge/<owner>/<repo>)`.',
      ],
    };
  },
};
