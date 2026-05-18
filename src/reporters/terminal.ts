import chalk from 'chalk';
import Table from 'cli-table3';
import { renderBadgeUrl } from './badge.js';
import type { CategoryReport, CheckResult, Grade, Report, Status } from '../types.js';

const STATUS_GLYPH: Record<Status, string> = {
  pass: '✓',
  fail: '✗',
  warn: '!',
  skip: '–',
};

function statusColor(status: Status): (s: string) => string {
  switch (status) {
    case 'pass':
      return chalk.green;
    case 'fail':
      return chalk.red;
    case 'warn':
      return chalk.yellow;
    case 'skip':
      return chalk.dim;
  }
}

function gradeColor(grade: Grade): (s: string) => string {
  if (grade === 'A+' || grade === 'A') return chalk.green.bold;
  if (grade === 'B') return chalk.cyan.bold;
  if (grade === 'C') return chalk.yellow.bold;
  return chalk.red.bold;
}

/**
 * Format a horizontal score bar of fixed width, filled in proportion to the
 * provided score. Used both for the overall score and for category scores.
 */
function bar(score: number, max: number, width = 28): string {
  if (max === 0) return ' '.repeat(width);
  const filled = Math.round((score / max) * width);
  const empty = width - filled;
  const filledColor =
    score / max >= 0.85 ? chalk.green : score / max >= 0.55 ? chalk.cyan : chalk.yellow;
  return filledColor('█'.repeat(filled)) + chalk.dim('░'.repeat(empty));
}

function renderHeader(report: Report): string {
  const lines: string[] = [];
  const header = chalk.bold.magenta('repo-vitals');
  lines.push('');
  lines.push(`  ${header}  ${chalk.dim('v' + report.version)}`);
  lines.push(chalk.dim('  ' + '─'.repeat(60)));
  lines.push(`  ${chalk.dim('Repo:')} ${report.repoPath}`);
  if (report.language) {
    lines.push(`  ${chalk.dim('Language:')} ${report.language}`);
  }
  lines.push('');
  const grade = gradeColor(report.grade)(`Grade ${report.grade}`);
  lines.push(`  Overall Score: ${chalk.bold(`${report.score}/100`)}  ${grade}`);
  lines.push(`  ${bar(report.score, 100, 50)}`);
  lines.push('');
  return lines.join('\n');
}

function renderCategory(cat: CategoryReport): string {
  const lines: string[] = [];
  lines.push(
    chalk.bold.cyan(`  ${cat.title}`) +
      chalk.dim(`  (${cat.score}/${cat.maxScore})  `) +
      bar(cat.score, cat.maxScore, 24),
  );
  for (const r of cat.checks) {
    lines.push(renderCheckLine(r));
  }
  lines.push('');
  return lines.join('\n');
}

function renderCheckLine(r: CheckResult): string {
  const color = statusColor(r.status);
  const glyph = color(STATUS_GLYPH[r.status]);
  const title = r.status === 'pass' ? chalk.white(r.title) : chalk.white.bold(r.title);
  const score = chalk.dim(`(${r.earned}/${r.weight})`);
  return `    ${glyph} ${title} ${score}\n      ${chalk.dim(r.message)}`;
}

function renderTopSuggestions(report: Report): string {
  if (report.topSuggestions.length === 0) return '';
  const lines: string[] = [];
  lines.push(chalk.bold.yellow('  Top suggestions to improve your score:'));
  report.topSuggestions.forEach((s, i) => {
    lines.push(`    ${chalk.yellow(`${i + 1}.`)} ${s}`);
  });
  lines.push('');
  return lines.join('\n');
}

function renderFooter(report: Report): string {
  const lines: string[] = [];
  lines.push(chalk.dim('  ' + '─'.repeat(60)));
  lines.push(chalk.dim('  Add a badge to your README:'));
  lines.push(chalk.dim(`    ![Repo Vitals: ${report.grade}](${renderBadgeUrl(report)})`));
  lines.push('');
  lines.push(chalk.dim('  Re-run with --fix to auto-create missing community files.'));
  lines.push('');
  return lines.join('\n');
}

/**
 * Render the human-friendly terminal report.
 *
 * The output mixes ANSI color codes with box-drawing characters; consumers
 * that need a plain-text representation should fall back to the JSON reporter
 * (see {@link renderJson}) or the markdown reporter.
 */
export function renderTerminal(report: Report): string {
  return [
    renderHeader(report),
    ...report.categories.map(renderCategory),
    renderTopSuggestions(report),
    renderFooter(report),
  ].join('\n');
}

/**
 * Compact one-line summary, useful when the user pipes the CLI's output
 * through other tools and only cares about the headline score.
 */
export function renderSummary(report: Report): string {
  const t = new Table({
    head: [chalk.bold('Score'), chalk.bold('Grade'), chalk.bold('Passing'), chalk.bold('Failing')],
    style: { head: [] },
  });
  const passing = report.checks.filter((c) => c.status === 'pass').length;
  const failing = report.checks.filter((c) => c.status === 'fail').length;
  t.push([
    `${report.score}/100`,
    gradeColor(report.grade)(report.grade),
    chalk.green(String(passing)),
    chalk.red(String(failing)),
  ]);
  return t.toString();
}
