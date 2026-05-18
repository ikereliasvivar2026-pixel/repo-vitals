# Changelog

All notable changes to **repo-vitals** are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2026-05-18

### Added

- Initial public release.
- 19 built-in checks across community, documentation, code quality, CI/CD,
  security and discoverability categories.
- `scan` command with `pretty`, `json`, `markdown` and `summary` output
  formats, plus `--only` / `--skip` / `--output` / `--fail-under` flags.
- `fix` command that non-destructively scaffolds `LICENSE`, `README.md`,
  `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, PR / issue
  templates, Dependabot config, `.editorconfig` and a language-aware
  `.gitignore`.
- `--dry-run` flag for `fix` to preview changes before writing.
- Programmatic API: `scan`, `fix`, `renderTerminal`, `renderJson`,
  `renderMarkdown`, `renderBadgeUrl`, `renderBadgeMarkdown` exported from the
  package root.
- Shareable shields.io badge for repository READMEs.
- Bundled GitHub Action (`ikereliasvivar2026-pixel/repo-vitals@v0`) that
  runs the scanner on every PR, posts a markdown report as a comment, and
  optionally fails the build below a score threshold.

[Unreleased]: https://github.com/ikereliasvivar2026-pixel/repo-vitals/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/ikereliasvivar2026-pixel/repo-vitals/releases/tag/v0.1.0
