import type { Grade, Report } from '../types.js';

/**
 * Map a {@link Grade} to the shields.io color slug it should use on the badge.
 */
function colorFor(grade: Grade): string {
  switch (grade) {
    case 'A+':
    case 'A':
      return 'brightgreen';
    case 'B':
      return 'green';
    case 'C':
      return 'yellow';
    case 'D':
      return 'orange';
    case 'F':
      return 'red';
  }
}

/**
 * Render a static shields.io badge URL for the given report.
 *
 * Stored separately from the live badge endpoint (`repo-vitals.dev/badge/...`)
 * because users can paste this directly into their README and it works
 * without depending on any external service beyond shields.io itself.
 */
export function renderBadgeUrl(report: Report): string {
  const label = encodeURIComponent('repo-vitals');
  const value = encodeURIComponent(`${report.grade} • ${report.score}`);
  return `https://img.shields.io/badge/${label}-${value}-${colorFor(report.grade)}`;
}

/**
 * Render the suggested Markdown snippet for embedding the badge in a README.
 */
export function renderBadgeMarkdown(report: Report, repoSlug?: string): string {
  const link = repoSlug
    ? `https://github.com/${repoSlug}`
    : 'https://github.com/ikereliasvivar2026-pixel/repo-vitals';
  return `[![Repo Vitals: ${report.grade}](${renderBadgeUrl(report)})](${link})`;
}
