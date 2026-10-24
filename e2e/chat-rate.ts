/**
 * Short fixed window for the local webServer. The route ignores values
 * below 1000. 8s is long enough for 20 sequential posts and short enough
 * that a poll sees the bucket open again without a fixed sleep.
 */
export const CHAT_RATE_WINDOW_MS = 8_000;
