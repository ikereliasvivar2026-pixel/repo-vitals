# Contributing to repo-vitals

First — thanks for considering a contribution. Every project needs contributors who care about open-source health, and `repo-vitals` is no exception.

## Where to start

The single most valuable contribution is: **run `npx repo-vitals` on a repo you maintain and tell us what was wrong**. False positives, false negatives, confusing messages, missed languages — all of it goes into [issues](https://github.com/ikereliasvivar2026-pixel/repo-vitals/issues).

Other great places to help:

- **Add a check** — `src/checks/` is one file per check. Twenty lines of code, plus a test, gets you a green PR. See "[Adding a check](#adding-a-check)" below.
- **Improve a fix template** — `src/fix/templates.ts` is just a set of string constants. Better defaults = better repos for everyone.
- **Add a language to detection** — `src/utils.ts:detectLanguage` is a flat list of marker files.
- **Improve docs / examples** — anywhere the README and CLI help text can be clearer.

## Local development

```sh
git clone https://github.com/ikereliasvivar2026-pixel/repo-vitals.git
cd repo-vitals
npm install
npm test
npm run build
node dist/cli.js scan .
```

Before pushing, run the full check matrix locally — CI does the same:

```sh
npm run lint
npm run format:check
npm run typecheck
npm test
npm run build
```

If `format:check` complains, `npm run format` writes the fixes.

## Adding a check

A check is a pure function from `CheckContext` to a result. The minimal shape:

```ts
// src/checks/my-check.ts
import type { Check } from '../types.js';

export const myCheck: Check = {
  id: 'my-check',
  title: 'A short, descriptive title',
  category: 'quality',
  severity: 'warning',
  weight: 2,
  fixable: false,
  run(ctx) {
    if (ctx.files.has('special-file')) {
      return { status: 'pass', earned: 2, message: 'Found special-file' };
    }
    return {
      status: 'fail',
      earned: 0,
      message: 'special-file missing',
      fixSuggestions: ['Add a special-file at the repo root.'],
    };
  },
};
```

Then export it from `src/checks/index.ts` and add a test under `tests/`. That's it.

Picking a weight is half art, half taste. Use these existing weights as anchors:

- `10` — README presence (the front door of the repo).
- `8` — LICENSE, tests, CI (without these, the repo barely qualifies as open source).
- `4` — CONTRIBUTING (high impact for contributors, but not blocking for users).
- `2` — `.gitignore`, badges, keywords (quality of life).
- `1` — `.editorconfig` (real but small impact).

## Commit messages

We follow [Conventional Commits](https://www.conventionalcommits.org/). The release pipeline relies on them. Examples:

- `feat(checks): add CodeQL workflow detection`
- `fix(fix): respect existing CODE_OF_CONDUCT casing`
- `docs: clarify the --fail-under flag`
- `refactor(reporters): extract bar() helper`

## Code of Conduct

By contributing you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).
