// SUFLER/suflerGateConfig.ts

export const SUFLER_GATE = {
  // audio segmentacija (kasnije)
  SEGMENT_MS: 1000,

  // koliko tišine znači "kraj tuđe rečenice"
  SILENCE_END_MS: 700,

  // koliko uzastopnih odluka treba da potvrdimo "OWNER" ili "NOT_OWNER"
  DECISION_SMOOTHING: 2,

  // nakon što sufler kaže repliku, koliko dugo šuti
  COOLDOWN_MS: 3000,

  // sufler replika kratka (ne stand-up specijal)
  MAX_REPLY_SENTENCES: 2,
} as const;

export type SuflerGateConfig = typeof SUFLER_GATE;
