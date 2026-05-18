/**
 * Single source of truth for the scanner version string.
 *
 * This is exported separately to avoid importing package.json at runtime,
 * which keeps the bundled CLI free of resolver hacks across module systems.
 * The release pipeline keeps this value in sync with package.json.
 */
export const VERSION = '0.1.0';
