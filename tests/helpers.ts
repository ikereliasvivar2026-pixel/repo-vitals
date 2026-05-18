import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

/**
 * Create a temporary directory containing the supplied files and return its
 * absolute path. Each test gets its own isolated tree, so two parallel tests
 * never clobber each other.
 */
export async function makeRepo(files: Record<string, string>): Promise<string> {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'repo-vitals-test-'));
  for (const [rel, content] of Object.entries(files)) {
    const full = path.join(dir, rel);
    await fs.mkdir(path.dirname(full), { recursive: true });
    await fs.writeFile(full, content, 'utf8');
  }
  return dir;
}

/**
 * Recursively remove a directory previously created by {@link makeRepo}.
 * Errors are swallowed because tests should always be allowed to finish.
 */
export async function cleanup(dir: string): Promise<void> {
  await fs.rm(dir, { recursive: true, force: true }).catch(() => {});
}
