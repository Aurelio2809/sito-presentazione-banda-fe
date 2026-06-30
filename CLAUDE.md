# CLAUDE.md — Wiki del progetto (Frontend)

> Documento vivo per gli agenti AI. **Consultalo prima di lavorare** e **aggiornalo** quando
> cambi convenzioni, struttura o aggiungi pattern riutilizzabili. Mantienilo conciso e veritiero.

## Cos'è
Frontend del sito della **Banda Musicale "Città di Casali del Manco"**. SPA pubblica + dashboard
admin. Sito live: https://bandamusicalecasalidelmanco.silaware.com — **è in produzione**.

## Stack
- **Angular 21** (componenti standalone + alcuni NgModule legacy in `features/main`).
- **Tailwind v4** (`src/styles.css`, blocco `@theme`) + CSS per-componente.
- **ngx-translate** per le 4 lingue.
- Build: `npx ng build --configuration production` (deve restare senza errori; budget CSS 16 kB/componente).
- Dev: `npm start` (usa `proxy.conf.json` → backend su :8080, così è same-origin).

## Struttura
- `src/app/features/main` — sito pubblico (home, about, about-history, about-today, about-school, gallery, events, contacts) + layout/nav/footer.
- `src/app/features/dashboard` — area admin protetta da `AuthGuard`.
- `src/app/core` — services (api/auth/gallery/event/message…), models, guards, interceptors.
- `src/app/shared` — componenti riusabili (ui-button, ui-input, page-toc, history-chapter, sources-box, loading-spinner…).
- `src/assets/i18n/{it,en,fr,es}.json` — traduzioni. `src/assets/` — immagini.

## ⚠️ REGOLA i18n (OBBLIGATORIA)
**Ogni testo visibile all'utente DEVE essere una chiave di traduzione**, mai hardcoded, e presente
in **tutte e 4 le lingue**: `it.json`, `en.json`, `fr.json`, `es.json`.
- Default app: `it`. Le 4 lingue devono avere **le stesse chiavi** (nessuna mancante/extra).
- Quando aggiungi testo: crea la chiave (es. `HOME.HERO.TITLE`) e valorizzala in tutti e 4 i file.
- Verifica parità chiavi prima di chiudere un task.
- **Debito noto**: la pagina `about-history` e alcune pagine about hanno ancora testo hardcoded in
  italiano da convertire a i18n. Se ci lavori, convertilo.

## Design system (brand) — usa SEMPRE questi token, non inventare colori
In `src/styles.css` `@theme`:
- Sfondo scuro `--color-banda-black:#0b0b0d`; testo `--color-banda-white`; secondario `rgba(255,255,255,.72)`.
- Accento oro `--color-banda-gold-400:#fbbf24` (sobrio, parsimonioso); rosso `--color-banda-red-500/700`.
- `--shadow-soft`. Font **Inter**.
Linguaggio: tema scuro elegante, glassmorphism leggero, accenti oro/rosso, hover `translateY(-2/3px)` +
glow tenue, ornamento dorato sotto i titoli, animazioni reveal allo scroll (`--p`/`--d`).
**Obiettivo estetico richiesto dal committente: pulito e "serio" tipo Apple** → sottrazione, spazio,
gerarchia tipografica, foto reali grandi; evitare eccessi (aloni pulsanti, gradient text ovunque).

## Responsive (mobile-first)
Breakpoint usati: **600 / 900 / 1200 / 1600 px**. Verifica SEMPRE mobile (≤600) e desktop.
Tap target ≥44px. Niente overflow orizzontale. Rispetta `prefers-reduced-motion` (vedi `styles.css`).

## Immagini
- Foto reali della banda (sorgenti locali del committente: `~/Desktop/migliori foto banda`, nomi
  descrittivi del contenuto). **Ottimizzale** prima di metterle in `src/assets/...`:
  `sips -Z 2000 -s format jpeg -s formatOptions 72 "<src>" --out src/assets/<area>/<nome>.jpg`.
- Scegli la foto **coerente col contenuto** del punto in cui va (concerti→chiesa/palco, storia→foto
  storiche/B-N, scuola→giovani/lezioni, processioni→strada/paese).
- `loading="lazy"` (eager solo per l'hero). `alt` sempre presente.

## API & sicurezza
- Base URL: `environment.apiUrl` = `/api` (relativo, same-origin). Auth a sessione (cookie), CSRF via
  `withXsrfConfiguration` (cookie `XSRF-TOKEN` → header `X-XSRF-TOKEN`). `AuthGuard` protegge `/dashboard`.
- In locale la galleria/eventi sono vuoti se il backend non gira.

## Agenti disponibili (`.claude/agents/`)
- `designer` — estetica/UX/styling. `security-auditor` — audit sicurezza FE.
- Avvio app per screenshot: `.claude/launch.json` (config `fe`, porta 4300).

## Deploy
Repo separato `Aurelio2809/sito-presentazione-banda-fe`. Push su branch **`integrazione`** → CI/CD
self-hosted ricostruisce il container. **Non** committare/pushare senza richiesta esplicita.
