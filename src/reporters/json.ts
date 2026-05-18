import type { Report } from '../types.js';

/**
 * Serialize a {@link Report} to a stable JSON string.
 *
 * Stable in this context means: keys are written in a deterministic order
 * matching the {@link Report} type, and numeric values are not re-formatted.
 * This is suitable both for human consumption and for diffing across runs.
 */
export function renderJson(report: Report, pretty = true): string {
  return JSON.stringify(report, null, pretty ? 2 : 0);
}
