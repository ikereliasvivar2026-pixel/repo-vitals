/**
 * Public, programmatic API for repo-vitals.
 *
 * The CLI in {@link ./cli.ts} is just a thin wrapper around these exports;
 * any third-party tool can consume the same surface to embed scanning in
 * GitHub Actions, dashboards, or custom workflows.
 */

export { scan, scoreToGrade } from './scanner.js';
export { fix } from './fix/index.js';
export { renderTerminal, renderSummary } from './reporters/terminal.js';
export { renderJson } from './reporters/json.js';
export { renderMarkdown } from './reporters/markdown.js';
export { renderBadgeUrl, renderBadgeMarkdown } from './reporters/badge.js';
export { DEFAULT_CHECKS } from './checks/index.js';
export { VERSION } from './version.js';
export type {
  Category,
  CategoryReport,
  Check,
  CheckContext,
  CheckResult,
  Grade,
  PackageJsonLike,
  Report,
  ScanOptions,
  Severity,
  Status,
} from './types.js';
