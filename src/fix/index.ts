import path from 'node:path';
import { promises as fs } from 'node:fs';
import { detectLanguage, exists, listRepoFiles, readPackageJson } from '../utils.js';
import {
  CODE_OF_CONDUCT,
  CONTRIBUTING,
  DEPENDABOT_CONFIG,
  EDITORCONFIG,
  ISSUE_BUG_TEMPLATE,
  ISSUE_FEATURE_TEMPLATE,
  PR_TEMPLATE,
  SECURITY,
  TemplateContext,
  gitignoreForLanguage,
  mitLicense,
  readmeStarter,
} from './templates.js';

export interface FixOptions {
  /** Repo path. Defaults to cwd. */
  cwd?: string;
  /** When true, log actions but don't write anything. */
  dryRun?: boolean;
  /** Holder used in the LICENSE template. Defaults to repo or package name. */
  holder?: string;
}

export interface FixResult {
  /** Files that were (or would be) created. Repo-relative paths. */
  created: string[];
  /** Files that already exist and were left untouched. Repo-relative paths. */
  skipped: string[];
  /** True if {@link FixOptions.dryRun} was set. */
  dryRun: boolean;
}

/**
 * Single source of truth for what `--fix` writes.
 *
 * Each entry is `{ path, generate }`. Generators are pure functions of the
 * {@link TemplateContext} so the same set powers both the dry-run report and
 * the real write path.
 */
function fixablesFor(ctx: TemplateContext): Array<{
  relPath: string;
  generate: () => string;
}> {
  return [
    { relPath: 'LICENSE', generate: () => mitLicense(ctx) },
    { relPath: 'README.md', generate: () => readmeStarter(ctx) },
    { relPath: 'CONTRIBUTING.md', generate: () => CONTRIBUTING },
    { relPath: 'CODE_OF_CONDUCT.md', generate: () => CODE_OF_CONDUCT },
    { relPath: 'SECURITY.md', generate: () => SECURITY },
    { relPath: '.gitignore', generate: () => gitignoreForLanguage(ctx.language) },
    { relPath: '.editorconfig', generate: () => EDITORCONFIG },
    {
      relPath: '.github/PULL_REQUEST_TEMPLATE.md',
      generate: () => PR_TEMPLATE,
    },
    {
      relPath: '.github/ISSUE_TEMPLATE/bug_report.md',
      generate: () => ISSUE_BUG_TEMPLATE,
    },
    {
      relPath: '.github/ISSUE_TEMPLATE/feature_request.md',
      generate: () => ISSUE_FEATURE_TEMPLATE,
    },
    { relPath: '.github/dependabot.yml', generate: () => DEPENDABOT_CONFIG },
  ];
}

/**
 * Create missing community / quality files non-destructively.
 *
 * Never overwrites existing files. Returns a structured {@link FixResult} so
 * callers can format their own report (CLI or programmatic).
 */
export async function fix(options: FixOptions = {}): Promise<FixResult> {
  const cwd = path.resolve(options.cwd ?? process.cwd());
  const pkg = await readPackageJson(cwd);
  const files = await listRepoFiles(cwd);
  const language = detectLanguage(files);

  const ctx: TemplateContext = {
    name: pkg?.name ?? path.basename(cwd),
    language,
    year: new Date().getFullYear(),
    holder: options.holder ?? extractHolder(pkg) ?? 'Project Authors',
  };

  const fixables = fixablesFor(ctx);
  const created: string[] = [];
  const skipped: string[] = [];

  for (const item of fixables) {
    const full = path.join(cwd, item.relPath);
    if (await exists(full)) {
      skipped.push(item.relPath);
      continue;
    }
    if (!options.dryRun) {
      await fs.mkdir(path.dirname(full), { recursive: true });
      await fs.writeFile(full, item.generate(), 'utf8');
    }
    created.push(item.relPath);
  }

  return { created, skipped, dryRun: !!options.dryRun };
}

/**
 * Best-effort extraction of an author/holder name from package.json.
 */
function extractHolder(pkg: Awaited<ReturnType<typeof readPackageJson>>): string | null {
  if (!pkg?.author) return null;
  if (typeof pkg.author === 'string') return pkg.author;
  return pkg.author.name ?? null;
}
