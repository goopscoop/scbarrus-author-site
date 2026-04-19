/**
 * Timings for the first-visit-of-day terminal boot sequence.
 * Adjust here until the feel is right.
 */

/** localStorage key — value is local calendar day YYYY-MM-DD */
export const TERMINAL_LOAD_STORAGE_KEY = 'refuge-terminal-load-day';

/** Nothing visible (empty shell) */
export const EMPTY_PAGE_MS = 200;

/** Green cursor blinks before "CONNECTION:" appears */
export const CURSOR_BLINK_TOTAL_MS = 750;
/** Full on/off cycles */
export const CURSOR_BLINK_CYCLES = 3;

/** Typewriter duration for "CONNECTION:" */
export const TYPE_CONNECTION_MS = 300;

/** Ellipsis after CONNECTION: (ping / wait) */
export const ELLIPSIS_BLINK_TOTAL_MS = 750;
export const ELLIPSIS_BLINK_CYCLES = 3;

/** Typewriter duration for "STABLE" (after "CONNECTION: ") */
export const TYPE_STABLE_MS = 300;

/** Pause after "CONNECTION: STABLE" completes */
export const PAUSE_AFTER_STABLE_MS = 300;

/** Typewriter duration for the header date line */
export const TYPE_DATE_MS = 300;

/** Pause after the date line finishes */
export const PAUSE_AFTER_DATE_MS = 300;

/** Left column (3 lines), typewriter — nav fades in with main/footer instead */
export const TYPE_HEADER_REMAINDER_MS = 750;

/** Pause after header remainder typing */
export const PAUSE_AFTER_HEADER_REMAINDER_MS = 300;

/** #main, #site-footer, and nav fade-in */
export const FADE_MAIN_FOOTER_MS = 1000;
