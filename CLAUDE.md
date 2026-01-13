# ŠKOLA-ŠALE — AI pravila rada (CLAUDE.md)
## 0) ZLATNO PRAVILO (NE POGAĐAJ)
Ako nemaš tačan kod / putanju / log / screenshot — traži to od Esada. Ne izmišljaj nazive fajlova, rute, dugmad ili korake.
## 1) UI PRAVILO (SAMO ŠTO SE VIDI)
Kad radimo po screenshotu: smiješ spominjati samo dugmad/teksteve/ikone koje se stvarno vide na slici. Ako ne vidiš — reci “ne vidim na slici” i traži novi screenshot.
## 2) JEDAN KORAK PO PORUCI
Uvijek daj tačno 1 korak (jedna radnja). Na kraju napiši šta očekuješ kao dokaz (npr. screenshot, log linija). Ne prelazi dalje dok Esad ne napiše "ok".


Ovaj fajl je “ugovor” i memorija projekta: sve što AI pogriješi jednom, ovdje postaje pravilo da se ne ponavlja.

---

## 0) Kontekst projekta (kratko)

- Glavna aplikacija: **React Native (Expo + Expo Router)** — projekat u rootu.
- SUFLER: **web prototip u Next.js** u podfolderu: `sufler/`
- Cilj: korisnik koristi odmah (bez naloga), privatnost po defaultu, SUFLER ključna funkcija.

---

## 1) Rječnik (ENG → BOS)

- state → stanje (trenutna vrijednost u komponenti)
- UI → interfejs (ono što korisnik vidi)
- route → ruta (putanja ekrana)
- screen → ekran
- storage → lokalno spremište (npr. AsyncStorage/localStorage)
- endpoint → API ruta
- gate → “kapija” (logika kad smije slušati/odgovoriti)
- VAD → detekcija govora (govor vs tišina/šum)
- diarization → razdvajanje govornika
- speaker verification → provjera govornika (OWNER/NOT_OWNER)
- cooldown → pauza nakon TTS-a

---
## 2) Zlatna pravila (NE KRŠI)

1) **Ne izmišljaj fajlove/putanje.** Ako nisi siguran — traži strukturu foldera ili naziv fajla.
2) **Ako korisnik kaže “samo sa slike”**: govori isključivo ono što se vidi na slici, bez pretpostavki.
3) **Jedna promjena = jedan mali “ticket”.** Ne miješati više tema u jednoj isporuci.
4) **Uvijek navedi:**
   - putanju fajla
   - šta tačno naći
   - šta tačno zamijeniti/zalijepiti
5) **Ne objašnjavaj osnove** (tipa “instaliraj VS Code”), osim ako korisnik eksplicitno traži “od nule”.
6) **UI tekst u aplikaciji je na BOSANSKOM.**  
   Izuzetak: kad korisnik radi u engleskom Android Studio/Emulator UI — tada **nazive dugmadi i menija piši na ENGLESKOM**, ali objašnjenje ostaje na BOSANSKOM.
7) **Bez laganja — ni kao šala.** (humor u app-u je “duhovito”, ali ne laž).

---

## 3) 5 AI chatova — uloge i šta radi ko

Ovo je organizacija za paralelni rad. Svaki AI ima svoju ulogu i “deliverable”.

### AI-1 — ORGANIZATOR (Dirigentov pomoćnik)
**Ne piše kod osim mini-fiksa.**  
Radi:
- pretvara cilj u listu tiketa (P0/P1/P2)
- kontroliše “dokaz gotovosti”
- vodi dnevnik odluka (Decision Log)
- traži od korisnika samo ono što fali (putanja fajla, screenshot, log)

**Isporuka:** plan + tiketi + checkliste.

### AI-2 — ARHITEKTA / SPEC (Sufler logika i privatnost)
Radi:
- specifikacija audio pipeline (Web/Next prototip → RN/native)
- privatnost model: lokalno embedding, opcioni enkriptovani backup voiceprinta
- definicija pragova: VAD, smoothing, confidence, fallback
- definicija test matrice (Android/iOS, BT slušalice)

**Isporuka:** dokument “Spec + acceptance criteria”.

### AI-3 — IMPLEMENTATOR RN (ŠKOLA-ŠALE app)
Radi:
- Expo Router rute, dugmad, navigacija
- Lekcije/vježbe struktura (30 lekcija + vježbe po lekciji)
- “placeholder” ekrani za ostala dugmad (da ništa ne puca)
- lokalna persistencija (npr. AsyncStorage) za napredak/istoriju

**Isporuka:** kod u RN projektu + provjera na emulatoru.

### AI-4 — IMPLEMENTATOR SUFLER (Next.js prototip)
Radi:
- audio capture (WebAudio), segmentacija (20–30ms)
- VAD integracija, anti-echo, gate integracija
- priprema “bridge” specifikacije za RN verziju (šta se prenosi 1:1)

**Isporuka:** kod u `sufler/` + dokaz (logovi/indikatori) da radi.

### AI-5 — QA / TEST / RELEASE
Radi:
- test plan + skripte testiranja
- regresija (da se ne pokvari postojeće)
- provjera grešaka, logovi bez audio sadržaja
- “definition of done” za P0

**Isporuka:** QA checklist + lista bugova + potvrda scenarija.

---

## 4) Kako komuniciramo (format tiketa)

Svaki tiket ima:

- **ID:** npr. RN-P0-01 ili SUF-P0-03
- **Cilj**
- **Fajlovi/putanje**
- **Promjena**
- **Dokaz gotovosti** (šta korisnik treba vidjeti)
- **Rizik** (šta može poći po zlu)

Primjer:
- ID: SUF-P0-03
- Cilj: WebAudio capture → buffer segmenata
- Dokaz: u konzoli “frames/sec” i “buffer length”

---

## 5) Pravila za SUFLER (prioritet P0)

### P0 cilj
- ignorisati OWNER
- odgovarati samo na NOT_OWNER
- bez upadanja u riječ
- anti-echo (ne odgovara na svoj TTS)
- radi stabilno u gužvi i na BT slušalicama

### “Preostalih 11 koraka” (SUFLER roadmap)
2) Owner onboarding (već UI postoji kao priprema)
3) Audio frame capture (WebAudio)
4) VAD robustno
5) Speaker verification (embedding + cosine + prag)
6) Stabilizacija odluke (decision smoothing)
7) Više sagovornika (klasteri A/B/C)
8) Timing: čekaj kraj tuđeg govora
9) Anti-echo (TTS block + cooldown)
10) Persistencija stanja
11) Postavke (minimalno prodajno)
12) Produkcijska pouzdanost + fallback

---

## 6) Pravila za RN app (ŠKOLA-ŠALE)

- Sva dugmad moraju voditi na validnu rutu (ako nije spremno → `/uskoro` ili placeholder ekran).
- “Lekcije i vježbe”: mora postojati stabilna ruta + fallback “Lekcija ne postoji” mora imati razlog (npr. id nije u data).
- Napredak/istorija: lokalno spremanje (AsyncStorage).  
- Ne uvoditi login.

---

## 7) Kada AI MORA pitati korisnika

AI mora pitati samo kad bez toga može pogriješiti:

- ne zna tačnu putanju fajla
- ne zna naziv rute u Expo Router-u
- treba screenshot/log da potvrdi stanje (npr. emulator, error stack)
- treba spisak “id” lekcija ili format data fajla

Sve ostalo: pretpostavke samo ako su bezopasne i jasno označene kao pretpostavke.

---

## 8) “Ne ponavljaj iste greške” — lista tipičnih grešaka

- Ne miješati **RN** i **Next.js** komande/putanje.
- Ne govoriti o dugmadima koja se **ne vide** na slici kad je “samo sa slike”.
- Ne pisati “pritisni r/a/s” u CMD — to važi samo u **expo start terminal prozoru** gdje je interaktivni meni.
- Ne tvrditi da fajl ne postoji bez `dir /s /b` provjere.
- Ne mijenjati UI tekstove u engleski (osim naziva dugmadi u Android Studio/Emulatoru).

---

## 9) Decision log (kratko)

Svaka važna odluka se upisuje ovdje:

- [2026-01-13] Odluka: Usvojen fajl CLAUDE.md kao obavezna pravila rada za sve AI u projektu ŠKOLA-ŠALE.  
  Razlog: Potrebno je spriječiti nagađanje, miješanje RN i Next.js konteksta i isporuke s više koraka odjednom.  
  Posljedica: Sav AI rad ide kroz tikete, jedan korak po poruci, uz obavezan dokaz gotovosti.


---

## 10) Trenutno poznate putanje (dopunjavati)

- RN menu: `app/(tabs)/index.tsx`
- Lekcije: `app/lekcije.tsx`, `app/[lekcija].tsx`, `app/TekstoviLekcija/lekcijeDo30.ts`
- SUFLER prototip: `sufler/` (Next.js)
- Gate: `sufler/src/app/ko-govori/suflerGate.ts`
- Gate config: `sufler/src/app/ko-govori/suflerGateConfig.ts`

KAD GOD se otkrije nova ključna putanja — dodati ovdje.
