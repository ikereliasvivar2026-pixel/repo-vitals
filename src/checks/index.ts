import type { Check } from '../types.js';
import { readmePresent, readmeQuality, readmeBadges } from './readme.js';
import { licensePresent } from './license.js';
import { contributingPresent } from './contributing.js';
import { codeOfConductPresent } from './code-of-conduct.js';
import { securityPresent } from './security.js';
import { issueTemplatesPresent, prTemplatePresent } from './issue-templates.js';
import { ciConfigured, dependabotConfigured } from './ci.js';
import {
  testsDetected,
  linterConfigured,
  editorconfigPresent,
  gitignorePresent,
  changelogPresent,
} from './tests.js';
import { packageDescription, packageKeywords, packageHomepage } from './discoverability.js';

/**
 * The default ordered list of checks shipped with repo-vitals.
 *
 * Order is informational: it controls the order checks appear in the terminal
 * report. The scoring algorithm itself is order-independent.
 */
export const DEFAULT_CHECKS: Check[] = [
  // Community
  readmePresent,
  licensePresent,
  contributingPresent,
  codeOfConductPresent,
  issueTemplatesPresent,
  prTemplatePresent,

  // Documentation
  readmeQuality,
  readmeBadges,
  changelogPresent,

  // Quality
  testsDetected,
  linterConfigured,
  gitignorePresent,
  editorconfigPresent,

  // CI
  ciConfigured,
  dependabotConfigured,

  // Security
  securityPresent,

  // Discoverability
  packageDescription,
  packageKeywords,
  packageHomepage,
];
