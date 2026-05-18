/**
 * Templates used by the auto-fix pipeline.
 *
 * Kept as plain string constants so they can be unit-tested without touching
 * the filesystem. Templates are intentionally minimal — repo-vitals is not a
 * scaffolder; it gets you to a passing score with sensible defaults that you
 * can then customize.
 */

export interface TemplateContext {
  /** Repo name, used in titles where it improves the boilerplate. */
  name: string;
  /** Detected primary language, used by the .gitignore template. */
  language: string | null;
  /** Current year, used in the LICENSE. */
  year: number;
  /** License holder name. */
  holder: string;
}

export function mitLicense(ctx: TemplateContext): string {
  return `MIT License

Copyright (c) ${ctx.year} ${ctx.holder}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`;
}

export function readmeStarter(ctx: TemplateContext): string {
  return `# ${ctx.name}

> One-sentence description of what this project does and why it exists.

## Installation

\`\`\`sh
# Replace with the install command appropriate to your stack
npm install ${ctx.name}
\`\`\`

## Usage

\`\`\`ts
// Minimal usage example.
\`\`\`

## Examples

Show 2–3 real-world snippets that solve concrete problems.

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a PR.

## License

[MIT](LICENSE) © ${ctx.holder}
`;
}

export const CONTRIBUTING = `# Contributing

Thanks for your interest in contributing! 🎉

## Quick start

1. Fork the repo and create your branch from \`main\`.
2. Install dependencies and make sure tests pass locally.
3. Add tests covering your change.
4. Open a Pull Request describing the problem and solution.

## Commit messages

We follow [Conventional Commits](https://www.conventionalcommits.org). Examples:

- \`feat: add support for X\`
- \`fix: prevent crash when Y\`
- \`docs: clarify install instructions\`

## Code style

Run the project's formatter and linter before pushing. CI will reject changes
that don't pass.

## Code of Conduct

By participating in this project you agree to abide by our
[Code of Conduct](CODE_OF_CONDUCT.md).
`;

export const CODE_OF_CONDUCT = `# Contributor Covenant Code of Conduct

## Our Pledge

We as members, contributors, and leaders pledge to make participation in our
community a harassment-free experience for everyone, regardless of age, body
size, visible or invisible disability, ethnicity, sex characteristics, gender
identity and expression, level of experience, education, socio-economic
status, nationality, personal appearance, race, religion, or sexual identity
and orientation.

We pledge to act and interact in ways that contribute to an open, welcoming,
diverse, inclusive, and healthy community.

## Our Standards

Examples of behavior that contributes to a positive environment for our
community include:

- Demonstrating empathy and kindness toward other people.
- Being respectful of differing opinions, viewpoints, and experiences.
- Giving and gracefully accepting constructive feedback.
- Accepting responsibility and apologizing to those affected by our mistakes.

Examples of unacceptable behavior include:

- The use of sexualized language or imagery, and sexual attention or advances
  of any kind.
- Trolling, insulting or derogatory comments, and personal or political
  attacks.
- Public or private harassment.
- Publishing others' private information, such as a physical or email address,
  without their explicit permission.

## Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be
reported to the project maintainers. All complaints will be reviewed and
investigated promptly and fairly.

This Code of Conduct is adapted from the [Contributor Covenant](https://www.contributor-covenant.org), version 2.1.
`;

export const SECURITY = `# Security Policy

## Supported versions

We support the latest minor release on the \`main\` branch.

## Reporting a vulnerability

Please **do not** open public GitHub issues for security vulnerabilities.

Instead, use [GitHub's private vulnerability reporting](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing/privately-reporting-a-security-vulnerability) on this repository.

We aim to acknowledge reports within 48 hours and ship a fix within 30 days
of confirmation.
`;

export const PR_TEMPLATE = `## Summary

<!-- What does this PR do? Link the issue it closes. -->

## Changes

- 

## Checklist

- [ ] Tests added or updated
- [ ] Documentation updated where relevant
- [ ] CI is green
`;

export const ISSUE_BUG_TEMPLATE = `---
name: Bug report
about: Report a reproducible bug
title: ''
labels: bug
assignees: ''
---

## Describe the bug

A clear and concise description of the bug.

## To reproduce

Steps:
1. 

## Expected behavior

What did you expect to happen?

## Environment

- OS:
- Version:
`;

export const ISSUE_FEATURE_TEMPLATE = `---
name: Feature request
about: Suggest an idea or improvement
title: ''
labels: enhancement
assignees: ''
---

## Problem

What problem are you trying to solve?

## Proposed solution

What would you like to see happen?

## Alternatives considered

What other approaches did you consider?
`;

export const DEPENDABOT_CONFIG = `version: 2
updates:
  - package-ecosystem: github-actions
    directory: "/"
    schedule:
      interval: weekly
  - package-ecosystem: npm
    directory: "/"
    schedule:
      interval: weekly
    open-pull-requests-limit: 10
`;

export const EDITORCONFIG = `root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false
`;

export function gitignoreForLanguage(language: string | null): string {
  switch (language) {
    case 'Python':
      return PYTHON_GITIGNORE;
    case 'Rust':
      return RUST_GITIGNORE;
    case 'Go':
      return GO_GITIGNORE;
    default:
      return NODE_GITIGNORE;
  }
}

const NODE_GITIGNORE = `node_modules/
dist/
build/
coverage/
*.log
.env
.env.*.local
.DS_Store
`;

const PYTHON_GITIGNORE = `__pycache__/
*.py[cod]
*$py.class
.venv/
venv/
.env
dist/
build/
*.egg-info/
.pytest_cache/
.coverage
htmlcov/
`;

const RUST_GITIGNORE = `/target
Cargo.lock
*.pdb
`;

const GO_GITIGNORE = `# Binaries
*.exe
*.dll
*.so
*.dylib

# Test binaries
*.test
*.out

# Build/coverage
/bin
/build
coverage.txt
`;
