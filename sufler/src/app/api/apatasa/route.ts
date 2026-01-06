import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

type Body = {
  text?: string;
  context?: string;
  input?: string;
  message?: string;
  transcript?: string;
};

function cleanOneLine(s: string): string {
  let out = String(s ?? "")
    .replace(/["“”‘’]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const parts = out.split(/(?<=[.!?])\s+/).filter(Boolean);
  if (parts.length >= 2) out = `${parts[0]} ${parts[1]}`.trim();
  else out = parts[0] ?? out;

  if (out.length > 180) out = out.slice(0, 177).trimEnd() + "...";
  if (!out) out = "Daj mi jednu rečenicu, pa ti dam repliku.";
  return out;
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Body;

  const text =
    body.text ?? body.input ?? body.message ?? body.transcript ?? "";
  const context = body.context ?? "";
  const combined = `${context}\n${text}`.trim();

  if (!combined) {
    return NextResponse.json({ reply: "Daj mi jednu rečenicu, pa ti dam repliku." });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { reply: "nema openai ključa u .env.local (OPENAI_API_KEY)." },
      { status: 500 }
    );
  }

  const client = new OpenAI({ apiKey });
  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

  const system = `
ti si AI SUFLER koji pomaže korisniku tokom živog razgovora.

ulaz: posljednja rečenica sagovornika + (opciono) kratki kontekst.
izlaz: vrati SAMO JEDNU repliku koju korisnik može odmah izgovoriti u uho.

stil:
- duhovito, pametno, prirodno
- blago sarkastično i šarmantno (nikad zlobno)
- brz prijatelj u uhu

pravila:
- 1 rečenica (max 2 kratke)
- bez emotikona
- bez laži
- bez navodnika
- bez objašnjavanja i bez dodatnog teksta
- bez vulgarnosti, uvreda, agresije
- ako je tema ozbiljna: blaga inteligentna opaska + empatija (bez šale na tuđu nesreću)
- ako nema dobrog: spas rečenica (sigurna, kratka)

humor (pojačan):
- ubaci 1 pametnu dosjetku ili neočekivan, ali fin obrt
- izbjegni generične fraze i ponavljanje
- ako može: mikro-ironija ili self-aware komentar, ali kratko

format:
- vrati samo repliku, ništa drugo
`.trim();


  try {
    const resp = await client.chat.completions.create({
      model,
      temperature: 1.1,
      messages: [
        { role: "system", content: system },
        { role: "user", content: `pojačaj humor malo, jedna kratka rečenica.\n\n${combined}` },
      ],
    });

    const raw = resp.choices?.[0]?.message?.content ?? "";
    return NextResponse.json({ reply: cleanOneLine(raw) });
  } catch (e: any) {
    const msg = String(e?.message ?? e);
    return NextResponse.json({ reply: `openai greška: ${msg}` }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true });
}
