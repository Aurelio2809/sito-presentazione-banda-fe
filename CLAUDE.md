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
- **Debito noto**: `about-history` (narrativa lunga dei capitoli) ha ancora testo hardcoded in
  italiano da convertire a i18n. Home, about, about-today, about-school, contacts, gallery, events
  sono già completamente tradotte (4 lingue, parità verificata).

## Design system (brand) — usa SEMPRE questi token, non inventare colori
In `src/styles.css` `@theme`:
- Sfondo scuro `--color-banda-black:#0b0b0d`; testo `--color-banda-white`; secondario `rgba(255,255,255,.72)`.
- Accento oro `--color-banda-gold-400:#fbbf24` (sobrio, parsimonioso); rosso `--color-banda-red-500/700`.
- `--shadow-soft`. Font **Inter**.
Linguaggio: tema scuro elegante, glassmorphism leggero, accenti oro/rosso, hover `translateY(-2/3px)` +
glow tenue, ornamento dorato sotto i titoli, animazioni reveal allo scroll (`--p`/`--d`).
**Obiettivo estetico richiesto dal committente: pulito e "serio" tipo Apple** → sottrazione, spazio,
gerarchia tipografica, foto reali grandi; evitare eccessi (aloni pulsanti, gradient text ovunque).

## Responsive (mobile-first + schermi grandi)
Breakpoint usati: **600 / 900 / 1200 / 1600 px**. Verifica SEMPRE mobile (≤600) e desktop.
Tap target ≥44px. Niente overflow orizzontale. Rispetta `prefers-reduced-motion` (vedi `styles.css`).
- **Schermi large/ultra-wide/4K-TV** (`styles.css`, ≥1800/2200/2800/3400px): il `font-size` di root
  scala a step così i container in `rem` e i testi in `ch` crescono in proporzione invece di restare
  piccoli in un grande vuoto. Non toccare senza verificare a 1920/2560/3440/3840px (screenshot).
- **Controlli mobile che si espandono (dropdown/accordion) rischiano overflow verticale** su schermi
  bassi (iPhone SE ecc.): un dropdown che "spinge" il layout sotto di sé può nascondere contenuto
  sotto la piega senza alcun indizio di scroll. Preferisci controlli compatti sempre-visibili (es.
  riga segmentata) invece di espansione inline quando le opzioni sono poche (vedi `lang-selector`
  variante mobile). Verifica sempre con screenshot reali (Chrome headless/Puppeteer), non solo CSS.

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
- **Pagine pubbliche con più chiamate API in `forkJoin` (gallery, events)**: usa `catchError` per
  singolo stream (non un unico `error` su tutto il forkJoin). Un endpoint secondario che fallisce
  (es. i preferiti) non deve azzerare tutta la pagina — mostra comunque il contenuto principale
  disponibile. Vedi `gallery.ts`/`events.ts` per il pattern.
- **Galleria**: la griglia/mosaico usano la **thumbnail** (leggera, per velocità); il **viewer a
  schermo intero** deve usare `getPhotoUrl()` (foto originale), non la thumbnail — altrimenti risulta
  sfocata quando ingrandita. La qualità JPEG delle thumbnail è impostata lato backend
  (`app.storage.thumbnail-jpeg-quality`, vedi wiki BE): non serve altro intervento FE per la nitidezza.

## Piano di rimedio estetico
In **`DESIGN_TODO.md`** (root repo) vive il piano operativo nato dall'audit grafico del
2026-07-12: difetti di sito e dashboard, rimedi, file coinvolti, priorità e ordine di
esecuzione. Consultarlo prima di lavorare sull'estetica e spuntare le voci completate.

## Sicurezza frontend e deploy
- Prima di un rilascio eseguire `npm audit --audit-level=low`, `npx tsc --noEmit` e `npm run build`.
- L'override Babel in `package.json` mantiene sicura la dipendenza transitiva del compilatore
  Angular: rimuoverlo solo quando `@angular/compiler-cli` incorpora una versione corretta.
- Non lasciare log con oggetti utente, credenziali, risposte di autenticazione o errori HTTP grezzi.
- Ogni link con `target="_blank"` deve usare almeno `rel="noopener"` (preferire
  `noopener noreferrer` per link esterni generici).
- Gli header di produzione e la Content Security Policy vivono in `nginx.conf`: quando si aggiunge
  un'origine esterna (font, iframe, API), aggiornare la direttiva minima necessaria e validare con
  `nginx -t`; non usare wildcard.
- Non rimuovere `.dockerignore`: impedisce che `.env`, `.git`, dipendenze e output locali entrino
  nel build context e nei layer/cache intermedi.

## Agenti disponibili (`.claude/agents/`)
- `designer` — estetica/UX/styling. `security-auditor` — audit sicurezza FE.
- `wiki-curator` — analizza un commit e aggiorna questo file se una convenzione è cambiata.
  Pensato per essere invocato dopo ogni commit (es. via hook `.githooks/post-commit`, non ancora
  attivato di default: l'attivazione automatica di un agente che fa commit da solo richiede
  un'autorizzazione esplicita dell'utente — vedi `.githooks/post-commit` per i dettagli). Può
  comunque essere richiamato a mano ("aggiorna la wiki").
- Avvio app per screenshot: `.claude/launch.json` (config `fe`, porta 4300). Per screenshot rapidi
  su viewport arbitrari (mobile/4K) è stato usato anche Chrome headless / Puppeteer-core ad-hoc.

## Deploy
Repo separato `Aurelio2809/sito-presentazione-banda-fe`. Push su branch **`integrazione`** → CI/CD
self-hosted ricostruisce il container. **Non** committare/pushare senza richiesta esplicita.
