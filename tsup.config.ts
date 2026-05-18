import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'tsup';

const SHEBANG = '#!/usr/bin/env node\n';

export default defineConfig({
  entry: ['src/index.ts', 'src/cli.ts'],
  format: ['esm'],
  target: 'node18',
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  shims: false,
  // Tsup's `banner` is applied to every emitted entry, but the shebang must
  // only appear on the executable CLI — emitting it on the library entry
  // (`dist/index.js`) is semantically wrong and can confuse downstream
  // bundlers. We instead prepend the shebang in `onSuccess` to `dist/cli.js`
  // only.
  async onSuccess() {
    const cliPath = resolve('dist', 'cli.js');
    const current = readFileSync(cliPath, 'utf8');
    if (!current.startsWith('#!')) {
      writeFileSync(cliPath, SHEBANG + current);
    }
  },
});
