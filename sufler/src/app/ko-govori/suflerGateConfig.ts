// SUFLER/ko-govori/suflerGate.ts
import { SUFLER_GATE } from "./suflerGateConfig";

export type SpeakerLabel = "OWNER" | "NOT_OWNER" | "UNKNOWN";
export type GateState =
  | "IDLE"
  | "LISTEN"
  | "OWNER_SPEAKING"
  | "PARTNER_SPEAKING"
  | "WAIT_SILENCE"
  | "COOLDOWN";

type GateInput = {
  nowMs: number;           // Date.now()
  vadSpeaking: boolean;    // da li trenutno ima govora (true/false)
  speaker: SpeakerLabel;   // OWNER / NOT_OWNER / UNKNOWN
};

type GateOutput = {
  allowProcessPartnerSpeech: boolean; // smiješ li slati partnerov govor u STT
  allowRespondNow: boolean;           // smiješ li sad izbaciti repliku
  state: GateState;
};

export class SuflerGate {
  private state: GateState = "IDLE";

  private ownerStreak = 0;
  private notOwnerStreak = 0;

  private lastSpeechMs: number | null = null;
  private cooldownUntilMs: number | null = null;

  start(nowMs: number) {
    this.state = "LISTEN";
    this.ownerStreak = 0;
    this.notOwnerStreak = 0;
    this.lastSpeechMs = null;
    this.cooldownUntilMs = null;
  }

  stop() {
    this.state = "IDLE";
  }

  getState(): GateState {
    return this.state;
  }

  tick(input: GateInput): GateOutput {
    const { nowMs, vadSpeaking, speaker } = input;

    // COOLDOWN
    if (this.cooldownUntilMs !== null && nowMs < this.cooldownUntilMs) {
      this.state = "COOLDOWN";
      return { allowProcessPartnerSpeech: false, allowRespondNow: false, state: this.state };
    }
    if (this.state === "COOLDOWN" && this.cooldownUntilMs !== null && nowMs >= this.cooldownUntilMs) {
      this.cooldownUntilMs = null;
      this.state = "LISTEN";
    }

    // GOVOR
    if (vadSpeaking) {
      this.lastSpeechMs = nowMs;

      // smoothing (2 uzastopna segmenta)
      if (speaker === "OWNER") {
        this.ownerStreak += 1;
        this.notOwnerStreak = 0;
      } else if (speaker === "NOT_OWNER") {
        this.notOwnerStreak += 1;
        this.ownerStreak = 0;
      } else {
        this.ownerStreak = 0;
        this.notOwnerStreak = 0;
      }

      if (this.ownerStreak >= SUFLER_GATE.DECISION_SMOOTHING) {
        this.state = "OWNER_SPEAKING";
        return { allowProcessPartnerSpeech: false, allowRespondNow: false, state: this.state };
      }

      if (this.notOwnerStreak >= SUFLER_GATE.DECISION_SMOOTHING) {
        this.state = "PARTNER_SPEAKING";
        return { allowProcessPartnerSpeech: true, allowRespondNow: false, state: this.state };
      }

      this.state = "LISTEN";
      return { allowProcessPartnerSpeech: false, allowRespondNow: false, state: this.state };
    }

    // TIŠINA
    if (this.lastSpeechMs !== null) {
      const silentFor = nowMs - this.lastSpeechMs;

      // partner je završio -> sad smije replika
      if (silentFor >= SUFLER_GATE.SILENCE_END_MS && this.state === "PARTNER_SPEAKING") {
        this.state = "WAIT_SILENCE";
        return { allowProcessPartnerSpeech: false, allowRespondNow: true, state: this.state };
      }

      // reset nakon dovoljno tišine
      if (silentFor >= SUFLER_GATE.SILENCE_END_MS) {
        this.state = "LISTEN";
        this.ownerStreak = 0;
        this.notOwnerStreak = 0;
      }
    }

    return { allowProcessPartnerSpeech: false, allowRespondNow: false, state: this.state };
  }

  // pozovi odmah nakon što SUFLER izgovori repliku
  enterCooldown(nowMs: number) {
    this.cooldownUntilMs = nowMs + SUFLER_GATE.COOLDOWN_MS;
    this.state = "COOLDOWN";
  }
}
