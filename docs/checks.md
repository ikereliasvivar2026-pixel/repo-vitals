# Built-in checks

Every scan runs the checks below. Each check contributes a fixed `weight` to
the overall score; the score is `round(earnedPoints / maxPoints * 100)`.

## Community

### `readme-present` — weight **10**

A repo without a `README` is a black box. We look for `README.md`, `README.rst`,
`README.txt` or `README`. Fixable via `repo-vitals fix`.

### `license-present` — weight **8**

We look for `LICENSE`, `LICENSE.md`, `LICENSE.txt`, `LICENSE.MIT`, `COPYING` or
`COPYING.md`. When found, we attempt to identify the license (MIT, Apache-2.0,
GPL-2.0/3.0, BSD-2/3, ISC, MPL-2.0, Unlicense). Fixable.

### `contributing-present` — weight **4**

`CONTRIBUTING.md` at the repo root or under `docs/` or `.github/`. Fixable.

### `code-of-conduct-present` — weight **3**

`CODE_OF_CONDUCT.md` at the repo root or under `docs/` or `.github/`. Fixable.

### `issue-templates-present` — weight **3**

At least one issue template under `.github/ISSUE_TEMPLATE/`, or a legacy
`.github/ISSUE_TEMPLATE.md`. Fixable.

### `pr-template-present` — weight **2**

`PULL_REQUEST_TEMPLATE.md` at the repo root, under `.github/`, or under
`docs/`. Fixable.

## Documentation

### `readme-quality` — weight **6**

The README is scanned for four sections, each worth 1–2 points:

- An install / quick-start / usage heading.
- An examples / usage heading.
- A license section or link.
- A contributing section or link.

### `readme-badges` — weight **2**

At least one shields.io / badge.fury.io / codecov.io badge.

### `changelog-present` — weight **2**

`CHANGELOG.md`, `CHANGELOG`, `CHANGES.md` or `HISTORY.md`.

## Code Quality

### `tests-detected` — weight **8**

Any of:

- A `test`, `tests`, `__tests__` or `spec` directory.
- Files matching `*.test.{js,jsx,ts,tsx}`, `*.spec.{js,jsx,ts,tsx}`,
  `*_test.go`, `*_spec.rb`, `test_*.py`.
- A known test runner in `dependencies` / `devDependencies` (`vitest`,
  `jest`, `mocha`, `ava`, `tap`, `tape`, `jasmine`, `cypress`,
  `playwright`, `@playwright/test`, `@testing-library/react`).

### `linter-configured` — weight **3**

Any of the common config files for ESLint, Ruff, Flake8, Rubocop, Clippy,
Biome, etc.

### `gitignore-present` — weight **2**

`.gitignore` at the repo root. Fixable with a language-aware template.

### `editorconfig-present` — weight **1**

`.editorconfig` at the repo root. Fixable.

## CI/CD

### `ci-configured` — weight **8**

At least one of: GitHub Actions (`.github/workflows/*.yml`), CircleCI
(`.circleci/config.yml`), GitLab CI (`.gitlab-ci.yml`), Travis
(`.travis.yml`), Azure Pipelines (`azure-pipelines.yml`), Jenkins
(`Jenkinsfile`).

### `dependabot-configured` — weight **3**

`.github/dependabot.yml` or any Renovate configuration (`renovate.json`,
`.renovaterc`, `.renovaterc.json`). Fixable.

## Security

### `security-present` — weight **3**

`SECURITY.md` at the repo root, under `docs/`, or under `.github/`. Fixable.

## SEO & Discoverability

### `package-description` — weight **2**

A `package.json` `description` of at least 20 characters. Skipped when no
`package.json` is found.

### `package-keywords` — weight **2**

A `keywords` array in `package.json` with at least 5 entries. 1 point is
awarded if there are some but fewer than 5.

### `package-homepage` — weight **1**

A `homepage` or `repository` field in `package.json`.

## Scoring

| Score range | Grade |
| ----------- | :---: |
| 95–100      |  A+   |
| 85–94       |   A   |
| 70–84       |   B   |
| 55–69       |   C   |
| 40–54       |   D   |
| 0–39        |   F   |
