import { afterEach, describe, expect, it } from 'vitest';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fix } from '../src/fix/index.js';
import { cleanup, makeRepo } from './helpers.js';

describe('fix', () => {
  let repo: string;
  afterEach(async () => {
    if (repo) await cleanup(repo);
  });

  it('creates missing community files', async () => {
    repo = await makeRepo({});
    const result = await fix({ cwd: repo, holder: 'Test User' });
    expect(result.created).toContain('LICENSE');
    expect(result.created).toContain('README.md');
    expect(result.created).toContain('CONTRIBUTING.md');
    const license = await fs.readFile(path.join(repo, 'LICENSE'), 'utf8');
    expect(license).toMatch(/MIT License/);
    expect(license).toMatch(/Test User/);
  });

  it('does not overwrite existing files', async () => {
    repo = await makeRepo({
      'README.md': '# Original',
      LICENSE: 'Custom license',
    });
    const result = await fix({ cwd: repo });
    expect(result.skipped).toContain('README.md');
    expect(result.skipped).toContain('LICENSE');
    const readme = await fs.readFile(path.join(repo, 'README.md'), 'utf8');
    expect(readme).toBe('# Original');
  });

  it('dry-run does not write any files', async () => {
    repo = await makeRepo({});
    const result = await fix({ cwd: repo, dryRun: true });
    expect(result.created.length).toBeGreaterThan(0);
    expect(result.dryRun).toBe(true);
    for (const rel of result.created) {
      await expect(fs.access(path.join(repo, rel))).rejects.toThrow();
    }
  });

  it('picks language-appropriate .gitignore', async () => {
    repo = await makeRepo({ 'pyproject.toml': '' });
    await fix({ cwd: repo });
    const gitignore = await fs.readFile(path.join(repo, '.gitignore'), 'utf8');
    expect(gitignore).toMatch(/__pycache__/);
  });
});
