"use client";

import { useRef, useState } from "react";
import { SuflerGate } from "./ko-govori";

export default function Home() {
  type HistoryItem = {
    at: number;          // Date.now()
    said: string;        // šta je sagovornik rekao (transkript)
    replied: string;     // šta je SUFLER odgovorio
  };

  const [history, setHistory] = useState<HistoryItem[]>([]);

  const [contextText, setContextText] = useState("");
  const [input, setInput] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [listening, setListening] = useState(false);


  const recogRef = useRef<any>(null);
  const gateRef = useRef<SuflerGate | null>(null);

  async function onGetReply(overrideText?: string) {
    const textToSend = (overrideText ?? input).trim();
    if (!textToSend) {
      setReply("nema teksta za poslati.");
      return;
    }
    const gate = gateRef.current;
    if (gate && gate.getState() === "COOLDOWN") {
      setReply("čekaj sekundu, još pričam.");
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
      setHistory((h) => [
        ...h,
        { at: Date.now(), said: textToSend, replied: r },
      ]);

      // tts: izgovori repliku (telefon će pustiti na bluetooth ako je povezan)
      if (r && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(r);
        u.lang = "hr-HR"; // ili "sr-RS"
        u.rate = 1.05;
        u.pitch = 1;

        // kad SUFLER završi izgovor, uđi u cooldown (pauza prije sljedeće replike)
        u.onend = () => gateRef.current?.enterCooldown(Date.now());

        window.speechSynthesis.speak(u);
      }

    } catch {
      setReply("nešto je puklo, probaj opet.");
    } finally {
      setLoading(false);
    }
  }

  function startListening() {
    if (!gateRef.current) gateRef.current = new SuflerGate();
    gateRef.current.start(Date.now());

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setReply("ovaj browser nema prepoznavanje govora; probaj chrome na telefonu.");
      return;
    }

    const r = new SpeechRecognition();
    recogRef.current = r;
    (recogRef as any).lastTranscript = "";

    r.lang = "hr-HR"; // ili "sr-RS"
    r.interimResults = false;
    r.continuous = true;

    r.onstart = () => setListening(true);
    r.onend = () => {
      setListening(false);

      const gate = gateRef.current;
      const out = gate?.tick({ nowMs: Date.now(), vadSpeaking: false, speaker: "OWNER" });

      if (out?.allowRespondNow) {
        const last = String(((recogRef as any).lastTranscript ?? input) ?? "").trim();
        if (last) onGetReply(last);
      }

      // restartuj samo ako NIJE stisnut STOP (stopListening postavlja recogRef.current = null)
      if (recogRef.current) {
        try {
          r.start();
        } catch { }
      }
    };





    r.onerror = (e: any) => {
      // ako se desi greška, ugasi sve da ne ostane “polu-upaljeno”
      recogRef.current = null;
      gateRef.current?.stop();

      setListening(false);
      setReply(`speech error: ${e?.error ?? "unknown"}`);
    };


    r.onresult = (e: any) => {
      const transcript = String(e?.results?.[0]?.[0]?.transcript ?? "").trim();
      if (!transcript) return;

      setInput(transcript);
      (recogRef as any).lastTranscript = transcript;

      // TEST: za sada se pravimo da uvijek govori SAGOVORNIK
      const gate = gateRef.current;
      gate?.tick({ nowMs: Date.now(), vadSpeaking: true, speaker: "OWNER" });

      // namjerno ne zovemo AI ovdje; zovemo ga tek na r.onend (kad je kraj govora)


    };


    r.start();
  }

  function stopListening() {
    try {
      recogRef.current?.stop?.();
    } catch { }

    gateRef.current?.stop();

    // bitno: ovo sprečava da r.onend “sam” ponovo upali slušanje
    recogRef.current = null;

    setListening(false);
  }



  async function onCopy() {
    try {
      await navigator.clipboard.writeText(reply);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch { }
  }

  return (
    <main style={{ maxWidth: 700, margin: "40px auto", padding: 16 }}>
      <h1 style={{ fontSize: 28, marginBottom: 12 }}>ai sufler</h1>

      <label style={{ display: "block", marginTop: 8, marginBottom: 6 }}>
        kontekst (opciono)
      </label>
      <textarea
        value={contextText}
        onChange={(e) => setContextText(e.target.value)}
        placeholder="1–2 prethodne rečenice ili situacija..."
        rows={3}
        style={{ width: "100%", padding: 12, fontSize: 16 }}
      />

      <label style={{ display: "block", marginTop: 14, marginBottom: 6 }}>
        šta je sagovornik upravo rekao
      </label>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="upiši zadnju rečenicu... (ili klikni slušaj)"
        rows={4}
        style={{ width: "100%", padding: 12, fontSize: 16 }}
      />

      <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>


        <button
          onClick={listening ? stopListening : startListening}
          disabled={loading}
          style={{ padding: "10px 14px", fontSize: 16 }}
        >
          {listening ? "stop" : "slušaj"}
        </button>
      </div>

      {reply ? (
        <>
          <p style={{ marginTop: 18, fontSize: 18, lineHeight: 1.4 }}>{reply}</p>

          <button
            onClick={onCopy}
            style={{ marginTop: 10, padding: "8px 12px", fontSize: 14 }}
          >
            {copied ? "kopirano" : "kopiraj repliku"}
          </button>
        </>
      ) : null}
      <div style={{ marginTop: 22 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>istorija</h2>

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
                    <strong>on:</strong> {item.said}
                  </div>
                  <div>
                    <strong>sufler:</strong> {item.replied}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

    </main>
  );
}
