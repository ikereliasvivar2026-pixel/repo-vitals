import { afterEach, describe, expect, it } from 'vitest';
import { scan, scoreToGrade } from '../src/scanner.js';
import { cleanup, makeRepo } from './helpers.js';

describe('scoreToGrade', () => {
  it.each([
    [100, 'A+'],
    [95, 'A+'],
    [94, 'A'],
    [85, 'A'],
    [70, 'B'],
    [55, 'C'],
    [40, 'D'],
    [0, 'F'],
  ])('maps score %i to grade %s', (score, expected) => {
    expect(scoreToGrade(score)).toBe(expected);
  });
});

describe('scan', () => {
  let repo: string;
  afterEach(async () => {
    if (repo) await cleanup(repo);
  });

  it('returns a 0–100 score for an empty repo', async () => {
    repo = await makeRepo({});
    const report = await scan({ cwd: repo });
    expect(report.score).toBeGreaterThanOrEqual(0);
    expect(report.score).toBeLessThan(50);
    expect(report.grade).toBe('F');
  });

  it('detects a README and lifts the score', async () => {
    repo = await makeRepo({
      'README.md': '# Hello\n\n## Install\n\nrun.\n\n## License\n\nMIT',
    });
    const report = await scan({ cwd: repo });
    const readme = report.checks.find((c) => c.id === 'readme-present');
    expect(readme?.status).toBe('pass');
  });

  it('detects MIT license content', async () => {
    repo = await makeRepo({
      LICENSE:
        'MIT License\n\nCopyright (c) 2026 Test\n\nPermission is hereby granted, free of charge, to any person obtaining a copy',
    });
    const report = await scan({ cwd: repo });
    const license = report.checks.find((c) => c.id === 'license-present');
    expect(license?.status).toBe('pass');
    expect(license?.message).toMatch(/MIT/);
  });

  it('marks linter as configured when eslint config is present', async () => {
    repo = await makeRepo({ '.eslintrc.json': '{}' });
    const report = await scan({ cwd: repo });
    const linter = report.checks.find((c) => c.id === 'linter-configured');
    expect(linter?.status).toBe('pass');
  });

  it('treats GitHub Actions workflows as CI', async () => {
    repo = await makeRepo({ '.github/workflows/ci.yml': 'name: CI\non: push\n' });
    const report = await scan({ cwd: repo });
    const ci = report.checks.find((c) => c.id === 'ci-configured');
    expect(ci?.status).toBe('pass');
  });

  it('flags packages without keywords', async () => {
    repo = await makeRepo({
      'package.json': JSON.stringify({ name: 'x', description: 'A meaningful description here' }),
    });
    const report = await scan({ cwd: repo });
    const kw = report.checks.find((c) => c.id === 'package-keywords');
    expect(kw?.status).toBe('fail');
  });

  it('detects a tests directory', async () => {
    repo = await makeRepo({ 'tests/sample.test.ts': 'export {}' });
    const report = await scan({ cwd: repo });
    const tests = report.checks.find((c) => c.id === 'tests-detected');
    expect(tests?.status).toBe('pass');
  });

  it('respects the --only option via ScanOptions', async () => {
    repo = await makeRepo({});
    const report = await scan({ cwd: repo, only: ['readme-present'] });
    expect(report.checks).toHaveLength(1);
    expect(report.checks[0]?.id).toBe('readme-present');
  });

  it('respects the --skip option via ScanOptions', async () => {
    repo = await makeRepo({});
    const report = await scan({ cwd: repo, skip: ['readme-present'] });
    expect(report.checks.find((c) => c.id === 'readme-present')).toBeUndefined();
  });

  it('produces top suggestions ordered by weight', async () => {
    repo = await makeRepo({});
    const report = await scan({ cwd: repo });
    expect(report.topSuggestions.length).toBeGreaterThan(0);
    expect(report.topSuggestions[0]).toMatch(/README/);
  });

  it('reaches a high score on a fully-equipped repo', async () => {
    repo = await makeRepo({
      'README.md':
        '# Sample\n\n[![CI](https://img.shields.io/badge/ci-passing-green)](#)\n\n## Install\n\nyarn add x\n\n## Examples\n\n```js\nuse(x);\n```\n\n## Contributing\n\nSee CONTRIBUTING.md.\n\n## License\n\nMIT.\n',
      LICENSE:
        'MIT License\n\nCopyright (c) 2026 Test\n\nPermission is hereby granted, free of charge, to any person obtaining a copy',
      'CONTRIBUTING.md': '# Contributing',
      'CODE_OF_CONDUCT.md': '# CoC',
      'SECURITY.md': '# Security',
      'CHANGELOG.md': '# Changelog',
      '.gitignore': 'node_modules\n',
      '.editorconfig': 'root = true\n',
      '.eslintrc.json': '{}',
      '.github/workflows/ci.yml': 'name: CI\non: push\n',
      '.github/dependabot.yml': 'version: 2\nupdates: []',
      '.github/PULL_REQUEST_TEMPLATE.md': 'PR',
      '.github/ISSUE_TEMPLATE/bug.md': 'Bug',
      'package.json': JSON.stringify({
        name: 'sample',
        description: 'A meaningful description of the sample project',
        keywords: ['a', 'b', 'c', 'd', 'e', 'f'],
        repository: 'https://github.com/example/sample',
      }),
      'tests/example.test.ts': 'export {}',
    });
    const report = await scan({ cwd: repo });
    expect(report.score).toBeGreaterThanOrEqual(85);
    expect(['A', 'A+']).toContain(report.grade);
  });
});
