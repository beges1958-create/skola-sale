"use client";

import { useEffect, useRef, useState } from "react";
import { SuflerGate } from "./ko-govori";

type OwnerCalibration = {
  createdAtISO: string;
  durationMs: number;
  samples: string[];
};

const OWNER_CALIBRATION_KEY = "sufler.ownerCalibration.v1";
const OWNER_CALIBRATION_DURATION_MS = 12_000;

function loadOwnerCalibration(): OwnerCalibration | null {
  try {
    const raw = localStorage.getItem(OWNER_CALIBRATION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as OwnerCalibration;
  } catch {
    return null;
  }
}

function saveOwnerCalibration(payload: OwnerCalibration) {
  try {
    localStorage.setItem(OWNER_CALIBRATION_KEY, JSON.stringify(payload));
  } catch {
    // ignore
  }
}

const OWNER_RECOVERY_CODE_KEY = "sufler.ownerRecoveryCode.v1";

function generateRecoveryCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const rnd = new Uint8Array(12);
  crypto.getRandomValues(rnd);

  const raw = Array.from(rnd)
    .map((b) => alphabet[b % alphabet.length])
    .join("");

  return `${raw.slice(0, 4)}-${raw.slice(4, 8)}-${raw.slice(8, 12)}`;
}

function loadRecoveryCode(): string | null {
  try {
    return localStorage.getItem(OWNER_RECOVERY_CODE_KEY);
  } catch {
    return null;
  }
}

function ensureRecoveryCode(): string {
  const existing = loadRecoveryCode();
  if (existing) return existing;

  const code = generateRecoveryCode();
  try {
    localStorage.setItem(OWNER_RECOVERY_CODE_KEY, code);
  } catch {
    // ignore
  }
  return code;
}

export default function Home() {
  type HistoryItem = {
    at: number;
    said: string;
    replied: string;
  };

  const [ownerCal, setOwnerCal] = useState<OwnerCalibration | null>(null);
  const [isCalibratingOwner, setIsCalibratingOwner] = useState(false);
  const [recoveryCode, setRecoveryCode] = useState<string>("");

  const [calibMsLeft, setCalibMsLeft] = useState<number>(0);
  const calibTextSamplesRef = useRef<string[]>([]);
  const calibTimerRef = useRef<number | null>(null);
  const calibTickRef = useRef<number | null>(null);

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [contextText, setContextText] = useState("");
  const [input, setInput] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [listening, setListening] = useState(false);

  const [testKoGovori, setTestKoGovori] = useState<"VLASNIK" | "SAGOVORNIK">("SAGOVORNIK");

  const recogRef = useRef<any>(null);
  const gateRef = useRef<SuflerGate | null>(null);

  useEffect(() => {
    const loaded = loadOwnerCalibration();
    setOwnerCal(loaded);
    const code = ensureRecoveryCode();
    setRecoveryCode(code);

    // učitaj istoriju iz localStorage (ako postoji)
    try {
      const raw = localStorage.getItem("sufler.history.v1");
      if (raw) {
        const parsed = JSON.parse(raw) as HistoryItem[];
        if (Array.isArray(parsed)) setHistory(parsed);
      }
    } catch {
      // ignore
    }
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("sufler.history.v1", JSON.stringify(history));
    } catch {
      // ignore
    }
  }, [history]);


  async function onGetReply(overrideText?: string) {
    const textToSend = (overrideText ?? input).trim();
    if (!textToSend) {
      setReply("Nema teksta za poslati.");
      return;
    }

    const gate = gateRef.current;
    if (gate && gate.getState() === "COOLDOWN") {
      setReply("Sačekaj sekundu, još pričam.");
      return;
    }

    setLoading(true);
    setReply("");
    setCopied(false);

    try {
      const res = await fetch("/api/apatasa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToSend, context: contextText }),
      });

      const data = await res.json();
      const r = String(data?.reply ?? "");
      setReply(r);

      setHistory((h) => [...h, { at: Date.now(), said: textToSend, replied: r }]);

      if (r && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(r);
        u.lang = "hr-HR";
        u.rate = 1.05;
        u.pitch = 1;
        u.onend = () => gateRef.current?.enterCooldown(Date.now());
        window.speechSynthesis.speak(u);
      }
    } catch {
      setReply("Nešto je puklo, probaj opet.");
    } finally {
      setLoading(false);
    }
  }

  function beginOwnerCalibration() {
    if (isCalibratingOwner) return;

    calibTextSamplesRef.current = [];
    setIsCalibratingOwner(true);
    setCalibMsLeft(OWNER_CALIBRATION_DURATION_MS);

    if (calibTickRef.current) window.clearInterval(calibTickRef.current);
    const startedAt = Date.now();
    calibTickRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const left = Math.max(0, OWNER_CALIBRATION_DURATION_MS - elapsed);
      setCalibMsLeft(left);
    }, 200);

    if (calibTimerRef.current) window.clearTimeout(calibTimerRef.current);
    calibTimerRef.current = window.setTimeout(() => {
      stopListening();
    }, OWNER_CALIBRATION_DURATION_MS);
  }

  function finalizeOwnerCalibration() {
    setIsCalibratingOwner(false);
    setCalibMsLeft(0);

    if (calibTickRef.current) {
      window.clearInterval(calibTickRef.current);
      calibTickRef.current = null;
    }
    if (calibTimerRef.current) {
      window.clearTimeout(calibTimerRef.current);
      calibTimerRef.current = null;
    }

    const payload: OwnerCalibration = {
      createdAtISO: new Date().toISOString(),
      durationMs: OWNER_CALIBRATION_DURATION_MS,
      samples: (calibTextSamplesRef.current ?? []).slice(0, 50),
    };

    saveOwnerCalibration(payload);
    setOwnerCal(payload);
    setReply("Glas podešen. Možeš krenuti sa razgovorom.");
  }
  function startListening() {
    if (!gateRef.current) gateRef.current = new SuflerGate();
    gateRef.current.start(Date.now());

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setReply("Ovaj browser nema prepoznavanje govora; probaj Chrome na telefonu.");
      return;
    }

    const r = new SpeechRecognition();
    recogRef.current = r;
    (recogRef as any).lastTranscript = "";

    r.lang = "hr-HR";
    r.interimResults = false;
    r.continuous = true;

    r.onstart = () => setListening(true);

    r.onend = () => {
      setListening(false);

      if (isCalibratingOwner) {
        finalizeOwnerCalibration();
        return;
      }

      const gate = gateRef.current;
      const out = gate?.tick({
        nowMs: Date.now(),
        vadSpeaking: false,
        speaker: testKoGovori === "VLASNIK" ? "OWNER" : "NOT_OWNER",
      });

      if (out?.allowRespondNow) {
        const last = String(((recogRef as any).lastTranscript ?? input) ?? "").trim();
        if (last) onGetReply(last);
      }

      if (!isCalibratingOwner && recogRef.current) {
        try {
          r.start();
        } catch {
          // ignore
        }
      }
    };

    r.onerror = (e: any) => {
      recogRef.current = null;
      gateRef.current?.stop();

      setListening(false);
      setReply(`Greška govora: ${e?.error ?? "nepoznato"}`);
    };

    r.onresult = (e: any) => {
      const transcript = String(e?.results?.[0]?.[0]?.transcript ?? "").trim();

      if (isCalibratingOwner && transcript) {
        calibTextSamplesRef.current.push(transcript);
      }

      if (!transcript) return;

      setInput(transcript);
      (recogRef as any).lastTranscript = transcript;

      const gate = gateRef.current;
      gate?.tick({
        nowMs: Date.now(),
        vadSpeaking: true,
        speaker: testKoGovori === "VLASNIK" ? "OWNER" : "NOT_OWNER",
      });
    };

    try {
      r.start();
    } catch {
      // ignore
    }
  }

  function stopListening() {
    try {
      recogRef.current?.stop?.();
    } catch {
      // ignore
    }

    gateRef.current?.stop();
    recogRef.current = null;
    setListening(false);
  }

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(reply);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  }

  return (
    <main style={{ maxWidth: 700, margin: "40px auto", padding: 16, paddingBottom: 120 }}>
      <h1 style={{ fontSize: 28, marginBottom: 12 }}>Sufler</h1>
      <div style={{ fontSize: 20, fontWeight: 800, opacity: 0.9, marginBottom: 16 }}>
        ŠAPTAČ PAMETNIH ODGOVORA
      </div>


      <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
        <div
          style={{
            width: 220,
            height: 220,
            borderRadius: "50%",
            background: ownerCal ? "#16a34a" : "#dc2626",
            color: "white",
            textShadow: "0 1px 2px rgba(0,0,0,0.35)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            fontWeight: 800,
            padding: 18,
            gap: 8,
          }}
        >
          <div style={{ fontSize: 20, lineHeight: 1.1 }}>Podešavanje glasa</div>
          <div style={{ fontSize: 14, fontWeight: 600, opacity: 0.95 }}>
            {ownerCal ? "podešeno" : "nije podešeno"}
          </div>
        </div>
      </div>

      <div
        style={{
          marginBottom: 12,
          padding: "8px 10px",
          border: "1px solid #eee",
          borderRadius: 10,
          fontSize: 14,
        }}
      >
        {ownerCal ? (
          <span>
            Glas vlasnika: <strong>podešen</strong> ({ownerCal.createdAtISO})
          </span>
        ) : (
          <span>
            Glas vlasnika: <strong>nije podešen</strong> — klikni <strong>Podesi glas vlasnika</strong> da ga podesiš.
          </span>
        )}
      </div>

      <div style={{ marginBottom: 12, padding: 12, border: "1px solid #ddd", borderRadius: 10 }}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>Rezervni kod za povrat</div>
        <div style={{ fontSize: 14, lineHeight: 1.4 }}>
          Sačuvaj ovaj kod (slikaj ili zapiši). Trebaće ti samo ako izgubiš ili promijeniš telefon.
        </div>

        <div style={{ marginTop: 8, fontSize: 18, letterSpacing: 1, fontFamily: "monospace" }}>
          {recoveryCode || "—"}
        </div>

        <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={async () => {
              if (!recoveryCode) return;
              try {
                await navigator.clipboard.writeText(recoveryCode);
              } catch {
                // ignore
              }
            }}
            style={{ padding: "8px 12px", fontSize: 14 }}
          >
            Kopiraj kod
          </button>

          <button
            type="button"


            onClick={() => {
              startListening();
            }}
            style={{ padding: "8px 12px", fontSize: 14 }}
          >
            Podesi glas vlasnika
          </button>



          <button
            type="button"
            disabled={isCalibratingOwner || loading}
            onClick={() => {
              if (listening) {
                stopListening();
                return;
              }
              startListening();
            }}
            style={{ padding: "8px 12px", fontSize: 14 }}
          >
            {listening ? "zaustavi" : "slušaj"}
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 14, color: "#fff" }}>
              Test: ko govori? <strong>{testKoGovori === "VLASNIK" ? "Vlasnik" : "Sagovornik"}</strong>
            </span>

            <button
              type="button"
              disabled={isCalibratingOwner}
              onClick={() => setTestKoGovori("SAGOVORNIK")}
              style={{
                padding: "8px 12px",
                fontSize: 14,
                border: "1px solid #ddd",
                borderRadius: 10,
                background: testKoGovori === "SAGOVORNIK" ? "#eee" : "transparent",
              }}
            >
              Sagovornik
            </button>

            <button
              type="button"
              disabled={isCalibratingOwner}
              onClick={() => setTestKoGovori("VLASNIK")}
              style={{
                padding: "8px 12px",
                fontSize: 14,
                border: "1px solid #ddd",
                borderRadius: 10,
                background: testKoGovori === "VLASNIK" ? "#eee" : "transparent",
              }}
            >
              Vlasnik
            </button>
          </div>
        </div>

        {reply ? (
          <>
            <p style={{ marginTop: 18, fontSize: 18, lineHeight: 1.4 }}>{reply}</p>

            <button
              type="button"
              onClick={onCopy}
              style={{ marginTop: 10, padding: "8px 12px", fontSize: 14 }}
            >
              {copied ? "Kopirano" : "Kopiraj repliku"}
            </button>
          </>
        ) : null}

        <div style={{ marginTop: 22, marginBottom: 120 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <h2 style={{ fontSize: 18, marginBottom: 8 }}>istorija</h2>

            <button
              type="button"
              onClick={() => {
                setHistory([]);
                try {
                  localStorage.removeItem("sufler.history.v1");
                } catch {
                  // ignore
                }
              }}
              style={{ padding: "8px 12px", fontSize: 14 }}
            >
              Obriši istoriju
            </button>
          </div>

          {history.length === 0 ? (
            <p style={{ opacity: 0.7 }}>još nema upisa.</p>
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {history
                .slice(-10)
                .reverse()
                .map((item, i) => (
                  <div
                    key={item.at + "-" + i}
                    style={{ padding: 12, border: "1px solid #ddd", borderRadius: 10 }}
                  >
                    <div style={{ fontSize: 14, opacity: 0.7, marginBottom: 6 }}>
                      {new Date(item.at).toISOString()}
                    </div>
                    <div style={{ marginBottom: 6 }}>
                      <strong>sagovornik:</strong> {item.said}
                    </div>
                    <div>
                      <strong>sufler:</strong> {item.replied}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {isCalibratingOwner && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.55)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 16,
              zIndex: 50,
            }}
          >
            <div
              style={{
                maxWidth: 520,
                width: "100%",
                background: "white",
                borderRadius: 14,
                padding: 16,
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Podešavanje glasa vlasnika</div>

              <div style={{ marginBottom: 10, lineHeight: 1.4 }}>
                Pričaj normalno oko <b>10–15 sekundi</b> (npr. 3 rečenice). Cilj je da aplikacija kasnije ignoriše tebe i daje
                replike samo drugima.
              </div>

              <div style={{ marginBottom: 12 }}>
                Preostalo: <b>{Math.ceil(calibMsLeft / 1000)} s</b>
              </div>

              <div style={{ fontSize: 12, opacity: 0.75 }}>
                (Ovo je priprema. Pravo prepoznavanje glasa iz audio signala dodajemo u narednim koracima.)
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
