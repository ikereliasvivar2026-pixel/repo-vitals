/**
 * Public types for the repo-vitals scanner and check system.
 *
 * Stable enough that downstream tools (custom checks, reporters, GitHub Actions)
 * can depend on them. Additive changes are non-breaking; removals are breaking.
 */

export type Severity = 'error' | 'warning' | 'info';

export type Category =
  | 'community'
  | 'documentation'
  | 'quality'
  | 'ci'
  | 'security'
  | 'discoverability';

export type Status = 'pass' | 'fail' | 'warn' | 'skip';

/**
 * Result of running a single check against a repo.
 */
export interface CheckResult {
  /** Stable id of the check, e.g. "readme-present". */
  id: string;
  /** Human-readable title. */
  title: string;
  /** Category the check belongs to. Used for grouping in reports. */
  category: Category;
  /** Pass/fail/warn/skip. */
  status: Status;
  /** Severity used to weight the score when the check does not pass. */
  severity: Severity;
  /** Maximum points contributed by this check. */
  weight: number;
  /** Points actually earned (0 .. weight). */
  earned: number;
  /** Short message shown next to the check. */
  message: string;
  /** Optional list of remediation steps. */
  fixSuggestions?: string[];
  /** Whether this check has an auto-fix implementation. */
  fixable?: boolean;
}

export interface CategoryReport {
  category: Category;
  title: string;
  score: number;
  maxScore: number;
  checks: CheckResult[];
}

export interface Report {
  /** Absolute path to the scanned repo on disk. */
  repoPath: string;
  /** Detected primary language, or null if unknown. */
  language: string | null;
  /** Scanner version. */
  version: string;
  /** ISO 8601 timestamp. */
  scannedAt: string;
  /** Total score, 0 .. 100. */
  score: number;
  /** Letter grade derived from score. */
  grade: Grade;
  /** Per-category breakdown. */
  categories: CategoryReport[];
  /** Flat list of all check results. */
  checks: CheckResult[];
  /** Top suggestions, ordered by impact. */
  topSuggestions: string[];
}

export type Grade = 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';

/**
 * Context passed to every check.
 *
 * The scanner pre-computes commonly needed information (file lists, parsed
 * package.json, etc.) once and shares it via the context so individual checks
 * stay fast and side-effect-free.
 */
export interface CheckContext {
  /** Absolute path to the repo root. */
  repoPath: string;
  /** Lower-cased relative paths of all tracked files. */
  files: Set<string>;
  /** Detected primary language. */
  language: string | null;
  /** Parsed root package.json if present. */
  packageJson: PackageJsonLike | null;
  /** Raw README content if present (else null). */
  readme: string | null;
  /** Lower-cased filename of the README that was found, e.g. "readme.md". */
  readmeFile: string | null;
}

export interface PackageJsonLike {
  name?: string;
  description?: string;
  version?: string;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  keywords?: string[];
  repository?: string | { type?: string; url?: string };
  bugs?: string | { url?: string };
  homepage?: string;
  license?: string;
  author?: string | { name?: string; email?: string };
  engines?: Record<string, string>;
  bin?: string | Record<string, string>;
}

/**
 * A single check function. Pure: takes context, returns a result.
 *
 * Checks must NOT mutate the context and must NOT touch the filesystem outside
 * of the repo path. They should complete in well under 100 ms.
 */
export interface Check {
  id: string;
  title: string;
  category: Category;
  severity: Severity;
  weight: number;
  /** Whether this check has an auto-fix implementation. */
  fixable?: boolean;
  /** Run the check against the given context. */
  run(
    ctx: CheckContext,
  ):
    | Promise<Omit<CheckResult, 'id' | 'title' | 'category' | 'severity' | 'weight'>>
    | Omit<CheckResult, 'id' | 'title' | 'category' | 'severity' | 'weight'>;
}

export interface ScanOptions {
  /** Repo path to scan. Defaults to cwd. */
  cwd?: string;
  /** Limit the checks that run, by id. */
  only?: string[];
  /** Skip these check ids. */
  skip?: string[];
}
