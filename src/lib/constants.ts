const SIXTY = 60 as const;
const TWENTY_FOUR = 24 as const;

export const SECONDS_IN_MINUTE = SIXTY;
export const SECONDS_IN_HOUR = SECONDS_IN_MINUTE * SIXTY;
export const SECONDS_IN_DAY = SECONDS_IN_HOUR * TWENTY_FOUR;
export const MILLISECONDS_IN_SECONDS = 1000;

export const DEFAULT_PORT = 3000;
