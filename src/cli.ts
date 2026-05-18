import { Command } from 'commander';
import chalk from 'chalk';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { scan } from './scanner.js';
import { fix } from './fix/index.js';
import { renderJson } from './reporters/json.js';
import { renderMarkdown } from './reporters/markdown.js';
import { renderSummary, renderTerminal } from './reporters/terminal.js';
import { VERSION } from './version.js';

interface ScanCommandOpts {
  cwd: string;
  format: 'pretty' | 'json' | 'markdown' | 'summary';
  only?: string[];
  skip?: string[];
  output?: string;
  failUnder?: string;
}

interface FixCommandOpts {
  cwd: string;
  dryRun: boolean;
  holder?: string;
}

/**
 * Build the commander program. Exported separately so tests can introspect
 * the command tree without spawning a subprocess.
 */
export function buildProgram(): Command {
  const program = new Command();
  program
    .name('repo-vitals')
    .description('Lighthouse for your open-source repos — score, audit and auto-fix repo health.')
    .version(VERSION);

  program
    .command('scan', { isDefault: true })
    .description('Audit a repository and produce a health score (0–100).')
    .argument('[path]', 'Path to the repo to scan', '.')
    .option('-f, --format <format>', 'Output format: pretty | json | markdown | summary', 'pretty')
    .option('--only <ids...>', 'Run only these check ids')
    .option('--skip <ids...>', 'Skip these check ids')
    .option('-o, --output <file>', 'Write the rendered report to this file instead of stdout')
    .option('--fail-under <score>', 'Exit non-zero if score is below this threshold (0–100)')
    .action(async (cwdArg: string, opts: Omit<ScanCommandOpts, 'cwd'>) => {
      await runScan({ ...opts, cwd: cwdArg });
    });

  program
    .command('fix')
    .description('Create missing community files (LICENSE, CONTRIBUTING, …) non-destructively.')
    .argument('[path]', 'Path to the repo to fix', '.')
    .option('--dry-run', 'Show what would be created without writing anything', false)
    .option('--holder <name>', 'Copyright holder used in the LICENSE')
    .action(async (cwdArg: string, opts: Omit<FixCommandOpts, 'cwd'>) => {
      await runFix({ ...opts, cwd: cwdArg });
    });

  return program;
}

async function runScan(opts: ScanCommandOpts): Promise<void> {
  const report = await scan({
    cwd: path.resolve(opts.cwd),
    only: opts.only,
    skip: opts.skip,
  });

  const formatted = formatReport(report, opts.format);
  if (opts.output) {
    await fs.writeFile(opts.output, stripAnsi(formatted), 'utf8');
    process.stdout.write(`${chalk.green('✓')} Report written to ${opts.output}\n`);
  } else {
    process.stdout.write(formatted + '\n');
  }

  const threshold = opts.failUnder !== undefined ? Number(opts.failUnder) : null;
  if (threshold !== null && !Number.isNaN(threshold) && report.score < threshold) {
    process.stderr.write(
      chalk.red(`\nScore ${report.score} is below threshold ${threshold}. Failing the run.\n`),
    );
    process.exit(1);
  }
}

function formatReport(
  report: Parameters<typeof renderTerminal>[0],
  format: ScanCommandOpts['format'],
): string {
  switch (format) {
    case 'json':
      return renderJson(report);
    case 'markdown':
      return renderMarkdown(report);
    case 'summary':
      return renderSummary(report);
    case 'pretty':
    default:
      return renderTerminal(report);
  }
}

async function runFix(opts: FixCommandOpts): Promise<void> {
  const result = await fix({
    cwd: path.resolve(opts.cwd),
    dryRun: opts.dryRun,
    holder: opts.holder,
  });
  const prefix = result.dryRun ? chalk.cyan('[dry-run] would create') : chalk.green('created');
  if (result.created.length === 0) {
    process.stdout.write(
      chalk.green('✓') +
        ' Nothing to create — repo already has all the supported community files.\n',
    );
  } else {
    for (const file of result.created) {
      process.stdout.write(`  ${prefix} ${file}\n`);
    }
  }
  if (result.skipped.length > 0) {
    process.stdout.write(
      chalk.dim(`\n${result.skipped.length} file(s) already existed and were left untouched.\n`),
    );
  }
  if (result.dryRun) {
    process.stdout.write(chalk.cyan('\nRe-run without --dry-run to apply.\n'));
  }
}

/**
 * Strip ANSI escape codes from a string. Used when piping the pretty terminal
 * report to a file via `--output`, so the file stays readable in editors.
 */
function stripAnsi(s: string): string {
  return s.replace(/\u001B\[[0-?]*[ -/]*[@-~]/g, '');
}

const isMain =
  process.argv[1] !== undefined &&
  import.meta.url === new URL(`file://${path.resolve(process.argv[1])}`).href;

if (isMain) {
  buildProgram()
    .parseAsync(process.argv)
    .catch((err) => {
      process.stderr.write(chalk.red(`Error: ${(err as Error).message}\n`));
      process.exit(1);
    });
}
