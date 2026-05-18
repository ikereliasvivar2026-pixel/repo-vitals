<div align="center">

# 🩺 repo-vitals

### Lighthouse for your open-source repos

**Audit your GitHub repository against 19+ open-source best practices in 1 second. Get a 0–100 score, an actionable to-do list, and a shareable badge for your README.**

[![npm version](https://img.shields.io/npm/v/repo-vitals?color=cb3837&logo=npm)](https://www.npmjs.com/package/repo-vitals)
[![CI](https://img.shields.io/github/actions/workflow/status/ikereliasvivar2026-pixel/repo-vitals/ci.yml?branch=main&label=CI&logo=github)](https://github.com/ikereliasvivar2026-pixel/repo-vitals/actions)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen?logo=node.js&logoColor=white)](https://nodejs.org)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-blueviolet)](CONTRIBUTING.md)
[![Repo Vitals: A+](https://img.shields.io/badge/repo--vitals-A%2B%20%E2%80%A2%20100-brightgreen)](https://github.com/ikereliasvivar2026-pixel/repo-vitals)

[**Quick start**](#-quick-start) ·
[**Features**](#-features) ·
[**GitHub Action**](#-github-action) ·
[**Badge**](#-badge) ·
[**Compare**](#-how-does-it-compare) ·
[**FAQ**](#-faq) ·
[**Contributing**](CONTRIBUTING.md)

</div>

---

## Why repo-vitals?

You wrote a great library. You shipped it. Now the issues pile up: _"Where's the LICENSE?"_, _"How do I contribute?"_, _"There's no CI."_

**repo-vitals** is a single command that audits your repository against the open-source standards that real maintainers care about — and tells you exactly what to add next. It's like running [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview) on a web page, but for your GitHub repo.

- 🔍 **19+ built-in checks** across community, documentation, code quality, CI/CD, security and discoverability.
- ⚡ **Sub-second** scans — no network calls, no GitHub token, runs entirely on the filesystem.
- 🩹 **`--fix` mode** auto-creates missing `LICENSE`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, issue templates, Dependabot config and more.
- 🤖 **GitHub Action included** — score every PR, fail the build on regressions, post a markdown report as a PR comment.
- 🛡 **Zero lock-in** — pure TypeScript, pluggable checks, JSON output for piping into other tools.

> _"`npx repo-vitals` is the first thing I run on every repo before public release."_ — you, hopefully, soon.

---

## 🚀 Quick start

```sh
# In any local repo
npx repo-vitals

# Or install once
npm install -g repo-vitals
repo-vitals
```

That's it. You'll get a colorized report like this:

```text
  repo-vitals  v0.1.0
  ────────────────────────────────────────────────────────────
  Repo: /home/you/projects/my-cool-library
  Language: JavaScript/TypeScript

  Overall Score: 73/100  Grade B
  ██████████████████████████████████████░░░░░░░░░░░░

  Community  (22/30)  ████████████████████░░░░
    ✓ README file present              (10/10)
    ✓ LICENSE file present              (8/8)
    ✗ CONTRIBUTING file present         (0/4)  No CONTRIBUTING guide found
    ✓ Code of Conduct present           (3/3)
    ...

  Top suggestions to improve your score:
    1. [CONTRIBUTING file present] Add a CONTRIBUTING.md describing how to set up the project.
    2. [SECURITY policy present] Add a SECURITY.md describing how to report vulnerabilities.
    3. ...
```

### Auto-fix what's missing

```sh
npx repo-vitals fix
```

That single command creates — non-destructively — every standard community file your repo is missing (LICENSE, CONTRIBUTING.md, CODE_OF_CONDUCT.md, SECURITY.md, PR template, issue templates, Dependabot config, .editorconfig, .gitignore). Existing files are never overwritten.

Want to preview first?

```sh
npx repo-vitals fix --dry-run
```

---

## ✨ Features

### Built-in checks (and growing)

| Category            | Check                                                                                                                                                                   |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Community**       | `README` present · `LICENSE` present (auto-detects MIT, Apache-2.0, GPL, BSD, ISC, MPL, Unlicense) · `CONTRIBUTING` · `CODE_OF_CONDUCT` · Issue templates · PR template |
| **Documentation**   | README has install/usage/license/contributing sections · README has status badges · `CHANGELOG` present                                                                 |
| **Code Quality**    | Tests detected (any of: `vitest`, `jest`, `mocha`, `ava`, `pytest`, `go test`, …) · Linter configured · `.gitignore` present · `.editorconfig` present                  |
| **CI/CD**           | CI configured (GitHub Actions, CircleCI, GitLab CI, Travis, Azure, Jenkins) · Dependabot or Renovate enabled                                                            |
| **Security**        | `SECURITY.md` present                                                                                                                                                   |
| **Discoverability** | `package.json` description set · 5+ keywords · `repository` / `homepage` set                                                                                            |

### Output formats

```sh
repo-vitals scan . --format pretty     # default, colorized terminal report
repo-vitals scan . --format json       # machine-readable, perfect for piping
repo-vitals scan . --format markdown   # ready to paste in a PR comment
repo-vitals scan . --format summary    # one-line score table
```

### Run only specific checks

```sh
repo-vitals scan . --only readme-present license-present ci-configured
```

### Fail the build below a threshold

```sh
repo-vitals scan . --fail-under 80
```

### Programmatic API

```ts
import { scan, renderMarkdown } from 'repo-vitals';

const report = await scan({ cwd: process.cwd() });
console.log(report.score, report.grade);
console.log(renderMarkdown(report));
```

Full types are exported — `Report`, `CheckResult`, `Check`, `Category`, `Grade`. See [`src/types.ts`](src/types.ts).

---

## 🤖 GitHub Action

Drop this into `.github/workflows/repo-vitals.yml`:

```yaml
name: Repo Vitals

on:
  pull_request:
  push:
    branches: [main]

permissions:
  contents: read
  pull-requests: write

jobs:
  vitals:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ikereliasvivar2026-pixel/repo-vitals@v0
        with:
          fail-under: '80'
          comment-on-pr: 'true'
```

Every PR will get a comment with the full markdown report. The build fails if the score drops below 80.

---

## 🏅 Badge

Add a live grade badge to your README and let the world know you take open-source health seriously:

```md
[![Repo Vitals: A+](https://img.shields.io/badge/repo--vitals-A%2B%20%E2%80%A2%20100-brightgreen)](https://github.com/ikereliasvivar2026-pixel/repo-vitals)
```

Or generate the exact URL for your repo from the CLI:

```sh
repo-vitals scan . --format json | jq -r '.score'
```

---

## ⚖️ How does it compare?

|                          | **repo-vitals** | GitHub Community Profile | OpenSSF Scorecard | Repolinter |
| ------------------------ | :-------------: | :----------------------: | :---------------: | :--------: |
| Runs locally, no network |       ✅        |            ❌            |        ❌         |     ✅     |
| Auto-fixes missing files |       ✅        |            ❌            |        ❌         | ⚠️ partial |
| Pluggable checks         |       ✅        |            ❌            |        ❌         |     ✅     |
| PR comment Action        |       ✅        |            ❌            |        ⚠️         |     ❌     |
| Shareable badge          |       ✅        |            ❌            |        ✅         |     ❌     |
| Sub-second scans         |       ✅        |           n/a            |        ❌         |     ⚠️     |
| Zero config              |       ✅        |            ✅            |        ❌         |     ❌     |

`repo-vitals` is not trying to replace deep security tooling like Scorecard — it's the **fast, daily-driver** companion you run before opening source, before tagging a release, or on every PR.

---

## 🧠 Philosophy

1. **Read-only by default.** A scan never modifies your repo. Mutations only happen via `fix` and never overwrite existing files.
2. **Fast or it doesn't ship.** Every check completes in under 100ms. The whole scan finishes before you can look up from your terminal.
3. **Honest, not preachy.** We weight checks by real-world impact. A missing LICENSE costs more than a missing `.editorconfig` — because it does.
4. **Composable.** All checks are pure functions over a shared context. Add yours in 20 lines.
5. **Boring stack.** TypeScript, Node 18+, zero exotic dependencies. The code you'd write if you weren't trying to impress anyone.

---

## 🛠 Configuration

`repo-vitals` runs zero-config by design. When you do want to customize, every command supports `--only` / `--skip` / `--fail-under` / `--format` / `--output`. A `repo-vitals.config.json` file is on the roadmap — see [#1](https://github.com/ikereliasvivar2026-pixel/repo-vitals/issues/1).

---

## ❓ FAQ

<details>
<summary><b>Does this work on languages other than JavaScript?</b></summary>

Yes. Checks are language-agnostic with a few light heuristics: tests are detected from `vitest`/`jest`/`mocha`/`pytest`/`go test` markers and from `tests/`, `__tests__/`, `spec/` directories. The `--fix` `.gitignore` template adapts to Python, Rust, Go and Node automatically.

</details>

<details>
<summary><b>Does it need a GitHub token?</b></summary>

No. The scanner is filesystem-only — it never contacts the GitHub API. The optional PR-commenting Action uses the standard `GITHUB_TOKEN` provided by the workflow.

</details>

<details>
<summary><b>Can I add my own check?</b></summary>

Yes — the public API exports `Check`, `CheckContext`, and `DEFAULT_CHECKS`. A check is a 20-line file. PRs adding new checks are very welcome — see [CONTRIBUTING.md](CONTRIBUTING.md).

</details>

<details>
<summary><b>Will <code>--fix</code> overwrite my files?</b></summary>

Never. `fix` only creates files that don't already exist. The behavior is fully covered by tests in [`tests/fix.test.ts`](tests/fix.test.ts).

</details>

<details>
<summary><b>How is the score calculated?</b></summary>

Every check has a `weight` reflecting its real-world impact (e.g. LICENSE = 8, README = 10, EditorConfig = 1). The score is `round(earned / max * 100)` and the letter grade maps the score onto the familiar A+/A/B/C/D/F scale, with `A+ ≥ 95`, `A ≥ 85`, `B ≥ 70`, `C ≥ 55`, `D ≥ 40`, `F < 40`.

</details>

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire and create. **Any contributions you make are greatly appreciated.**

The easiest way to help: run `npx repo-vitals` on a repo you maintain and open an issue with anything that's wrong, missing, or could be smarter. Adding a new check is a great first PR — see [CONTRIBUTING.md](CONTRIBUTING.md).

---

## 📜 License

Released under the [MIT License](LICENSE).

<sub>Made with care for the open-source community. If `repo-vitals` saved you time, ⭐ the repo and share the badge.</sub>
