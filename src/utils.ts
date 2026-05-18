import { promises as fs } from 'node:fs';
import path from 'node:path';
import fg from 'fast-glob';
import type { PackageJsonLike } from './types.js';

/**
 * Read a UTF-8 file, returning null if it doesn't exist.
 */
export async function readFileSafe(filePath: string): Promise<string | null> {
  try {
    return await fs.readFile(filePath, 'utf8');
  } catch {
    return null;
  }
}

/**
 * Check whether a path exists (file or directory).
 */
export async function exists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Return a Set of repo-relative file paths, lower-cased for case-insensitive
 * lookups. Common heavy directories are excluded.
 */
export async function listRepoFiles(repoPath: string): Promise<Set<string>> {
  const ignore = [
    '**/node_modules/**',
    '**/.git/**',
    '**/dist/**',
    '**/build/**',
    '**/coverage/**',
    '**/.next/**',
    '**/.cache/**',
    '**/__pycache__/**',
    '**/venv/**',
    '**/.venv/**',
    '**/target/**',
  ];
  const entries = await fg('**/*', {
    cwd: repoPath,
    ignore,
    dot: true,
    onlyFiles: false,
    markDirectories: true,
    suppressErrors: true,
  });
  return new Set(entries.map((p) => p.toLowerCase()));
}

/**
 * Parse package.json at repo root if it exists.
 */
export async function readPackageJson(repoPath: string): Promise<PackageJsonLike | null> {
  const raw = await readFileSafe(path.join(repoPath, 'package.json'));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PackageJsonLike;
  } catch {
    return null;
  }
}

const README_CANDIDATES = [
  'README.md',
  'README.rst',
  'README.txt',
  'README',
  'readme.md',
  'Readme.md',
];

/**
 * Locate and read the README, preferring conventional casings.
 *
 * Returns the resolved relative filename so reporters can tell users exactly
 * which file was scanned.
 */
export async function findReadme(
  repoPath: string,
): Promise<{ name: string; content: string } | null> {
  for (const candidate of README_CANDIDATES) {
    const full = path.join(repoPath, candidate);
    const content = await readFileSafe(full);
    if (content !== null) {
      return { name: candidate, content };
    }
  }
  return null;
}

/**
 * Heuristically detect the primary language of the repo from marker files.
 *
 * This is intentionally simple — repo-vitals checks are language-agnostic in
 * spirit, and language detection is only used for nicer messages and for the
 * `.gitignore` check.
 */
export function detectLanguage(files: Set<string>): string | null {
  const has = (name: string) => files.has(name.toLowerCase());

  if (has('package.json')) return 'JavaScript/TypeScript';
  if (has('pyproject.toml') || has('setup.py') || has('requirements.txt')) return 'Python';
  if (has('cargo.toml')) return 'Rust';
  if (has('go.mod')) return 'Go';
  if (has('pom.xml') || has('build.gradle') || has('build.gradle.kts')) return 'Java';
  if (has('gemfile') || has('rakefile')) return 'Ruby';
  if (has('composer.json')) return 'PHP';
  if (has('mix.exs')) return 'Elixir';
  if (has('pubspec.yaml')) return 'Dart';
  if (has('cmakelists.txt')) return 'C/C++';
  if (has('dune-project') || has('opam')) return 'OCaml';
  return null;
}

/**
 * Returns true if at least one of the given paths exists in the file index.
 * Path matching is case-insensitive and respects directory structure.
 */
export function hasAnyPath(files: Set<string>, candidates: string[]): boolean {
  return candidates.some((c) => files.has(c.toLowerCase()) || files.has(`${c.toLowerCase()}/`));
}

/**
 * Returns true if any tracked file matches the given glob-style suffix.
 *
 * Only supports a leading "**\/" pattern, which is enough for our checks.
 */
export function hasFileMatching(files: Set<string>, suffix: string): boolean {
  const lower = suffix.toLowerCase();
  for (const f of files) {
    if (f.endsWith(lower)) return true;
  }
  return false;
}

/**
 * Returns true if any tracked file lives under the given directory prefix.
 */
export function hasFileUnder(files: Set<string>, dir: string): boolean {
  const lower = dir.toLowerCase().replace(/\/?$/, '/');
  for (const f of files) {
    if (f.startsWith(lower)) return true;
  }
  return false;
}
