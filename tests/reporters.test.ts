import { afterEach, describe, expect, it } from 'vitest';
import { scan } from '../src/scanner.js';
import { renderJson } from '../src/reporters/json.js';
import { renderMarkdown } from '../src/reporters/markdown.js';
import { renderBadgeMarkdown, renderBadgeUrl } from '../src/reporters/badge.js';
import { renderSummary, renderTerminal } from '../src/reporters/terminal.js';
import { cleanup, makeRepo } from './helpers.js';

describe('reporters', () => {
  let repo: string;
  afterEach(async () => {
    if (repo) await cleanup(repo);
  });

  it('renders JSON that round-trips', async () => {
    repo = await makeRepo({});
    const report = await scan({ cwd: repo });
    const json = renderJson(report);
    const parsed = JSON.parse(json);
    expect(parsed.score).toBe(report.score);
    expect(parsed.grade).toBe(report.grade);
    expect(parsed.checks.length).toBe(report.checks.length);
  });

  it('renders markdown with a header and a category table', async () => {
    repo = await makeRepo({});
    const report = await scan({ cwd: repo });
    const md = renderMarkdown(report);
    expect(md).toMatch(/Repo Vitals Report/);
    expect(md).toMatch(/\| Status \| Check \| Points \| Message \|/);
  });

  it('renders the badge URL using shields.io', async () => {
    repo = await makeRepo({});
    const report = await scan({ cwd: repo });
    expect(renderBadgeUrl(report)).toMatch(/^https:\/\/img\.shields\.io\/badge\//);
    expect(renderBadgeMarkdown(report)).toMatch(/\[!\[Repo Vitals/);
  });

  it('renders the terminal report without throwing and contains the score', async () => {
    repo = await makeRepo({});
    const report = await scan({ cwd: repo });
    const out = renderTerminal(report);
    expect(out).toContain(String(report.score));
  });

  it('renders a compact summary table', async () => {
    repo = await makeRepo({});
    const report = await scan({ cwd: repo });
    const summary = renderSummary(report);
    expect(summary).toContain('Score');
    expect(summary).toContain('Grade');
  });
});
