/* eslint-disable no-magic-numbers */

// Time-related constants
const SIXTY = 60 as const;
const TWENTY_FOUR = 24 as const;
const SEVEN = 7 as const;

export const SECONDS_IN_MINUTE = SIXTY;
export const SECONDS_IN_HOUR = SECONDS_IN_MINUTE * SIXTY;
export const SECONDS_IN_DAY = SECONDS_IN_HOUR * TWENTY_FOUR;
export const MILLISECONDS_IN_SECONDS = 1000;

// Port
export const DEFAULT_PORT = 3000;

// ESLint configuration constants
export const MAX_NESTED_CALLBACKS = 3;
export const MAX_STATEMENTS = 30;
export const SONARJS_COGNITIVE_COMPLEXITY = 15;
export const SONARJS_MAX_SWITCH_CASES = 10;

// UI constants
export const PERCENTAGE_FULL = 100;
export const SIDEBAR_COOKIE_MAX_AGE_SECONDS = SIXTY * SIXTY * TWENTY_FOUR * SEVEN;
export const RANDOM_WIDTH_MIN = 40;
export const RANDOM_WIDTH_MAX = 50;

// Animation delays (in milliseconds)
export const ANIMATION_DELAY_MULTIPLIER = 100;
