// SUFLER/ko-govori/suflerGateConfig.ts

export const SUFLER_GATE = {
  SEGMENT_MS: 30,
  SILENCE_END_MS: 700,
  DECISION_SMOOTHING: 2,
  COOLDOWN_MS: 1200,
  MAX_REPLY_SENTENCES: 2,
} as const;
