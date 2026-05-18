import path from 'node:path';
import { DEFAULT_CHECKS } from './checks/index.js';
import { detectLanguage, findReadme, listRepoFiles, readPackageJson } from './utils.js';
import type {
  CategoryReport,
  Category,
  Check,
  CheckContext,
  CheckResult,
  Grade,
  Report,
  ScanOptions,
} from './types.js';
import { VERSION } from './version.js';

const CATEGORY_TITLES: Record<Category, string> = {
  community: 'Community',
  documentation: 'Documentation',
  quality: 'Code Quality',
  ci: 'CI/CD',
  security: 'Security',
  discoverability: 'SEO & Discoverability',
};

/**
 * Convert a 0..100 score to a letter grade.
 *
 * Thresholds match common open-source maturity scoring (e.g. OpenSSF
 * Scorecard) so users moving between tools see consistent results.
 */
export function scoreToGrade(score: number): Grade {
  if (score >= 95) return 'A+';
  if (score >= 85) return 'A';
  if (score >= 70) return 'B';
  if (score >= 55) return 'C';
  if (score >= 40) return 'D';
  return 'F';
}

/**
 * Run the configured checks against the repo and assemble a {@link Report}.
 *
 * The scan is intentionally read-only — no file is ever modified by this
 * function. The {@link fix} pipeline handles mutations separately.
 */
export async function scan(options: ScanOptions = {}): Promise<Report> {
  const cwd = path.resolve(options.cwd ?? process.cwd());
  const ctx = await buildContext(cwd);
  const checks = filterChecks(DEFAULT_CHECKS, options);

  const results = await runChecks(checks, ctx);
  return assembleReport(cwd, ctx, results);
}

/**
 * Resolve which checks to run based on `only` / `skip` filters.
 */
function filterChecks(checks: Check[], options: ScanOptions): Check[] {
  const only = options.only?.length ? new Set(options.only) : null;
  const skip = new Set(options.skip ?? []);
  return checks.filter((c) => {
    if (only && !only.has(c.id)) return false;
    if (skip.has(c.id)) return false;
    return true;
  });
}

/**
 * Pre-compute the {@link CheckContext} shared across all checks.
 */
async function buildContext(repoPath: string): Promise<CheckContext> {
  const [files, packageJson, readme] = await Promise.all([
    listRepoFiles(repoPath),
    readPackageJson(repoPath),
    findReadme(repoPath),
  ]);
  return {
    repoPath,
    files,
    language: detectLanguage(files),
    packageJson,
    readme: readme?.content ?? null,
    readmeFile: readme?.name ?? null,
  };
}

/**
 * Execute the checks sequentially and decorate raw results with their static
 * descriptors. Failures inside an individual check are caught so a single bad
 * check can't take down the whole scan.
 */
async function runChecks(checks: Check[], ctx: CheckContext): Promise<CheckResult[]> {
  const out: CheckResult[] = [];
  for (const check of checks) {
    try {
      const partial = await check.run(ctx);
      out.push({
        id: check.id,
        title: check.title,
        category: check.category,
        severity: check.severity,
        weight: check.weight,
        ...partial,
        fixable: partial.fixable ?? check.fixable,
      });
    } catch (err) {
      out.push({
        id: check.id,
        title: check.title,
        category: check.category,
        severity: 'info',
        weight: check.weight,
        status: 'skip',
        earned: 0,
        message: `Check failed: ${(err as Error).message}`,
      });
    }
  }
  return out;
}

function assembleReport(repoPath: string, ctx: CheckContext, results: CheckResult[]): Report {
  const categories = groupByCategory(results);
  // Skipped checks are not-applicable to this repo (e.g. package.json checks on a
  // Python project) — they must not inflate the denominator, otherwise even a
  // perfect non-JS repo can never reach A+.
  const applicable = results.filter((r) => r.status !== 'skip');
  const totalEarned = applicable.reduce((sum, r) => sum + r.earned, 0);
  const totalWeight = applicable.reduce((sum, r) => sum + r.weight, 0);
  const score = totalWeight === 0 ? 0 : Math.round((totalEarned / totalWeight) * 100);
  return {
    repoPath,
    language: ctx.language,
    version: VERSION,
    scannedAt: new Date().toISOString(),
    score,
    grade: scoreToGrade(score),
    categories,
    checks: results,
    topSuggestions: pickTopSuggestions(results),
  };
}

function groupByCategory(results: CheckResult[]): CategoryReport[] {
  const byCat = new Map<Category, CheckResult[]>();
  for (const r of results) {
    const list = byCat.get(r.category) ?? [];
    list.push(r);
    byCat.set(r.category, list);
  }
  const order: Category[] = [
    'community',
    'documentation',
    'quality',
    'ci',
    'security',
    'discoverability',
  ];
  return order
    .map<CategoryReport | null>((category) => {
      const checks = byCat.get(category);
      if (!checks?.length) return null;
      const applicable = checks.filter((r) => r.status !== 'skip');
      const earned = applicable.reduce((s, r) => s + r.earned, 0);
      const max = applicable.reduce((s, r) => s + r.weight, 0);
      return {
        category,
        title: CATEGORY_TITLES[category],
        score: earned,
        maxScore: max,
        checks,
      };
    })
    .filter((c): c is CategoryReport => c !== null);
}

/**
 * Pick the highest-impact, actionable next steps.
 *
 * "Impact" is approximated by check weight: a single failed weight-10 check
 * has roughly 10x the score impact of a weight-1 check, so we sort by weight
 * and surface the first concrete suggestion of each.
 */
function pickTopSuggestions(results: CheckResult[]): string[] {
  const failing = results
    .filter((r) => r.status === 'fail' || r.status === 'warn')
    .filter((r) => (r.fixSuggestions?.length ?? 0) > 0)
    .sort((a, b) => b.weight - a.weight);
  const out: string[] = [];
  for (const r of failing) {
    const suggestion = r.fixSuggestions?.[0];
    if (suggestion) {
      out.push(`[${r.title}] ${suggestion}`);
    }
    if (out.length >= 5) break;
  }
  return out;
}
