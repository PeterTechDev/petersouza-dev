/**
 * Mode query for /playground.
 *
 * This file stays free of the bug catalog and of assertPlaygroundFixture().
 * src/lib/i18n.ts may import it. Importing src/lib/playground-bugs.ts from
 * shared bundles would ship the fixture to every page and crash the site
 * when the fixture check throws.
 */

export const PLAYGROUND_MODE_PARAM = "mode";
export const PLAYGROUND_FIXED_MODE = "fixed";

export const fixedModeQuery = `?${PLAYGROUND_MODE_PARAM}=${PLAYGROUND_FIXED_MODE}`;
