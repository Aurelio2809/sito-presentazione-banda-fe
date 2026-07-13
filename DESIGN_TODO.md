# Piano di rimedio estetico — Sito + Dashboard

> Documento operativo nato dall'audit grafico del 2026-07-12 (studio su Apple HIG, NN/g,
> best practice dark-mode/luxury/dashboard, redesign NASA 2023). Ogni voce elenca il
> difetto, il rimedio e i file coinvolti. Spuntare al completamento e aggiornare la
> colonna Stato. **Regola generale: prima le fondamenta (F), poi le pagine (P), poi la
> dashboard (D).** Ogni intervento va verificato con build production pulita + screenshot
> mobile/desktop/large prima del push.

## Seconda iterazione 2026-07-13 — feedback del committente

La prima proposta era coerente ma ancora troppo scura: l'header antracite, sommato a
pannelli quasi neri e filigrana ridotta al minimo, aveva tolto personalità al sito.
Questa passata corregge la direzione senza annullare il lavoro precedente.

| Feedback | Decisione applicata | Stato / verifica |
|---|---|---|
| Galleria non funzionante | Avviati Docker Desktop, PostgreSQL `dev-postgres` e backend Spring locale; verificato proxy Angular | **Risolto** — API 200, 7 elementi reali |
| Sito troppo scuro | Tema semantico caldo con `prefers-color-scheme`; dark meno nero e light avorio | **Completato** — screenshot dark/light |
| Header aggiunge un'altra superficie scura | Glass antracite nel dark, glass avorio nel light; rosso resta accento | **Completato** |
| Filigrana persa | Partitura riportata a 11%/7,5% con maschera + stemma editoriale grande e tenue | **Completato** |
| Card “Chi siamo” poco convincenti | Superfici liquid-glass con blur, saturazione, bordo e highlight interni; padding ridotto e fluido | **Completato** |
| Stesso problema nelle pagine interne | Applicato lo stesso sistema a Oggi, Scuola, Storia, Eventi e Contatti | **Completato** |
| Login dashboard da ripensare | Nuovo layout editoriale split-screen, fotografia reale e modulo lineare; variante mobile dedicata | **Completato** |
| Credito autore nel footer | Inserito “Creato da Aurelio Marotta” e traduzioni | **Parziale** — manca l'URL LinkedIn esatto |

### QA della seconda iterazione

- Build production pulita: bundle iniziale 330,39 kB, nessun warning.
- Chrome locale: Home, Chi siamo, Galleria e Login in tema dark/light; login anche a 390×844.
- Nessun errore JavaScript e `scrollWidth === viewport` in tutte le viste ricontrollate.
- Tema verificato tramite emulazione reale di `prefers-color-scheme`, senza toggle o stato duplicato.
- Questa verifica è stata mostrata localmente prima del gate di rilascio.

## Punto 8 — audit sicurezza e rilascio (2026-07-13)

Il committente ha dato l'OK esplicito al punto 8. Prima del commit sono stati eseguiti:

- `npm audit --audit-level=low`: **0 vulnerabilità** dopo l'allineamento sicuro di Babel tramite
  override della sola dipendenza transitiva di `@angular/compiler-cli`.
- Ricerca di credenziali/API key/private key nel sorgente tracciato: **nessun segreto trovato**.
- Rimossi i log del guard che mostravano username e stato di autenticazione; rimossi i log di
  diagnostica del servizio galleria; aggiunto `noopener noreferrer` al CTA esterno riutilizzabile.
- Rafforzato `nginx.conf` con Content Security Policy, protezioni MIME/frame/referrer/permissions
  anche nella location degli asset statici; sintassi validata con `nginx:alpine` (`nginx -t`).
- Aggiunto `.dockerignore`: dipendenze, output, metadati Git e soprattutto eventuali `.env` non
  entrano più nel build context o nella cache Docker.
- Build Docker production completata; container nginx verificato su `/`, asset CSS e route SPA
  `/dashboard/login` (HTTP 200), con CSP e tutti gli header attesi presenti anche sugli asset.
- Backend: test Maven **1/1 superato**; verificati CSRF per SPA, session cookie `Secure` e
  `SameSite=Strict`, BCrypt, HSTS, Swagger riservato agli admin e autorizzazioni sulle API.
- Frontend: TypeScript e build production puliti; bundle iniziale **328,51 kB**; 242 chiavi
  scalari allineate per ognuna delle quattro lingue.
- La suite frontend legacy resta un debito noto: non arriva all'esecuzione perché i vecchi TestBed
  non importano i moduli usati nei template. Non è un errore della build applicativa né una
  regressione di sicurezza; va trattato in una milestone test dedicata.

## Riesame conclusivo 2026-07-13 — evidenze e direzione

### Verifica svolta
- **Frontend locale**: `http://localhost:4200/`; backend Spring su `http://localhost:8080/` e
  PostgreSQL Docker attivi. Galleria verificata sia con dati reali sia negli stati fallback.
- **Matrice responsive**: 9 percorsi pubblici/login a 320, 375, 1440 e 1920 CSS px; nessun
  overflow orizzontale dopo il fix della griglia di `about/today`.
- **Interazioni**: menu mobile, chiusura con Escape, blocco scroll, cambio lingua con aggiornamento
  di `<html lang>`, focus visibile e `prefers-reduced-motion`.
- **Qualità tecnica**: build production e TypeScript puliti; parità di 242 chiavi su tutte le
  quattro lingue; budget CSS rispettato.
- **Debito test preesistente**: `ng test --watch=false` non arriva ai test perché diversi spec
  legacy dichiarano componenti NgModule senza importare `RouterModule`, `TranslateModule` e i
  componenti figli. Va riallineato il TestBed in un intervento dedicato; la build applicativa non
  presenta gli stessi errori.

### Valutazione estetica

**Cosa funziona bene**
1. Fotografie vere, stemma e palette nero/oro/rosso danno un'identità riconoscibile e non da template.
2. Fraunces per i display e Inter per il corpo creano un tono editoriale adatto a tradizione e cultura.
3. La hero fotografica racconta subito la banda; l'header cambia luminosità col sistema e lascia il
   contenuto in primo piano.
4. Chi siamo e le pagine interne usano vetro traslucido; la login dashboard ha una gerarchia
   editoriale separata e riconoscibile.

**Cosa non funzionava e perché**
1. Doppio stemma, badge, titolo, testo e due CTA rendevano la hero desktop ridondante.
2. Filigrana e gradienti erano troppo presenti e riducevano l'effetto di spazio/contrasto.
3. Errori API mostrati come testo tecnico facevano sembrare Galleria ed Eventi incompleti.
4. Tre ori, troppi raggi/pesi/durate e popup nativi rendevano sito e dashboard incoerenti.
5. Una griglia a due colonne aveva un overflow di 2 px a 320 px su `about/today`.

### Principi adottati dallo studio
- [Apple HIG — Layout](https://developer.apple.com/design/human-interface-guidelines/layout),
  [Color](https://developer.apple.com/design/human-interface-guidelines/color) e
  [Typography](https://developer.apple.com/design/human-interface-guidelines/typography): gerarchia
  immediata, spazio, tipografia leggibile e colore con funzione precisa.
- [Apple](https://www.apple.com/): una proposta dominante, titolo breve, immagine protagonista e
  non più di due azioni principali.
- [Ferrari](https://www.ferrari.com/): fotografia a pieno formato e storytelling emotivo; si adotta
  l'intensità visiva, non la densità o l'autoplay.
- [Berliner Philharmoniker](https://www.berliner-philharmoniker.de/en/): riferimento pertinente per
  un'istituzione musicale; immagine immersiva, navigazione netta, CTA singola e brand tipografico forte.
- [WCAG 2.2 — Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html),
  [Contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) e
  [Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html): 320 px senza
  perdita, contrasto AA e controlli utilizzabili.

## Top 10 — priorità e stato

| # | Priorità | Miglioria | Stato | Evidenza |
|---|---|---|---|---|
| 1 | P0 | Reflow mobile su tutti i percorsi | Completata | 320/375 px, `scrollWidth === viewport` |
| 2 | P0 | Hero più essenziale | Completata | rimosso stemma duplicato, una gerarchia dominante |
| 3 | P1 | Token oro/superfici/raggi/motion | Completata | zero vecchi ori o raggi fuori scala |
| 4 | P1 | Scala tipografica e pesi | Completata | nessun testo sotto 13 px; massimo 700 nei componenti |
| 5 | P1 | Decorazione con personalità ma controllata | Completata | partitura mascherata + stemma filigrana |
| 6 | P1 | Stati vuoti/errore editoriali | Completata | componente condiviso con testo e CTA |
| 7 | P1 | Immagini stabili e responsive | Completata per asset statici | dimensioni note, lazy/eager e `object-fit` coerenti |
| 8 | P2 | Footer editoriale e i18n | Completata | brand, navigazione, social e legal in 4 lingue |
| 9 | P2 | Feedback dashboard coerente | Completata | zero `alert()`/`confirm()` nativi; modale + toast |
| 10 | P2 | Accessibilità e micro-interazioni | Completata | Escape, aria, `lang`, reduced motion, tap target |

## Milestone e board locale

| Milestone | Task | Stato | Evidenza di chiusura |
|---|---|---|---|
| M1 — Stabilità | T1 Reflow + T2 menu mobile | Fatto | matrice 320/375/1440/1920 |
| M2 — Sistema | T3 token + T4 tipografia | Fatto | audit CSS e build pulita |
| M3 — Contenuto | T5 hero + T6 tema/fondali + T7 empty state + T8 immagini | Fatto | screenshot dark/light, desktop/mobile |
| M3.1 — Feedback | tema sistema + liquid glass + nuova login + credito autore | Fatto* | *URL LinkedIn in attesa |
| M4 — Dashboard | T9 feedback/modali e icone | Fatto | nessun popup browser nativo |
| M5 — Qualità | T10 accessibilità e regressione | Fatto | TypeScript, i18n, build, interazioni |
| M6 — Rilascio | audit sicurezza, documentazione finale, commit/push | **Completata** | OK esplicito del 2026-07-13, audit superato |

> **Gate di rilascio superato il 2026-07-13:** audit finale concluso e pubblicazione autorizzata.

## Legenda priorità
- 🔴 Alta — impatto visivo percepito subito
- 🟡 Media — qualità/coerenza
- 🟢 Bassa — rifinitura

---

## F. Fondamenta del design system

### F1. 🔴 Unificare i tre "ori" in un token unico
- **Difetto**: 123 usi di `rgba(255,215,0,…)` (#FFD700), 40 di `rgba(255,200,87,…)`, solo 5 usi del token `--color-banda-gold-400` (#fbbf24). Tinte dorate incoerenti tra pagine.
- **Rimedio**: scegliere UNA tinta oro (proposta: tenere `#fbbf24` del token, o promuovere `255,200,87` a token se si preferisce più caldo). Definire in `styles.css` le varianti opacità come custom property (`--gold`, `--gold-soft`, `--gold-border`…) e sostituire TUTTE le occorrenze hardcoded con `color-mix()`/var.
- **File**: `src/styles.css` + ricerca globale `255, 215, 0` e `255, 200, 87` in tutti i `.css` di `src/app`.
- **Verifica**: `grep -rn "255, 215, 0\|255,215,0\|255, 200, 87" src/app --include="*.css"` deve restituire 0 risultati.
- **Stato**: ☑ completato — zero occorrenze dei due ori storici nei CSS componenti

### F2. 🔴 Scala tipografica a 3 livelli + corpi più grandi
- **Difetto**: convivono 10/11/12/13/14/15/16px come corpi (troppi gradini vicini); 10-12px è microscopico su monitor grandi. NN/g: max 3 taglie.
- **Rimedio**: definire in `styles.css` una scala tokenizzata, es. `--text-xs: 13px` (didascalie/meta), `--text-sm: 15px` (secondario), `--text-base: 17px` (corpo), più i display in `clamp()` già esistenti. Sostituire i px sparsi: 10-11px → xs, 12-14px → sm, 15-16px → base. Nessun testo sotto 13px.
- **File**: `src/styles.css` + tutti i `.css` di `features/main` e `features/dashboard`.
- **Verifica**: `grep -rn "font-size: 1[01]px" src/app --include="*.css"` → 0 risultati.
- **Stato**: ☑ completato — nessun `font-size` da 10/11/12 px nei componenti

### F3. 🔴 Gerarchia titoli coerente (serif + pesi)
- **Difetto**: Fraunces solo su h1/h2; gli h3 delle card restano Inter 900. Weight 900 su 13-16px è pesantissimo (il luxury usa pesi medi su taglie grandi).
- **Rimedio**: decidere la regola e applicarla ovunque: h1/h2 = Fraunces 600; h3 = Inter 700 (non 800/900) con taglia da scala F2; label/eyebrow = Inter 600 uppercase tracking largo. Ridurre i `font-weight: 900` sparsi (accettabili solo su display molto grandi).
- **File**: `src/styles.css` (regola globale), poi rimozione override nei css di pagina.
- **Stato**: ☑ completato — Fraunces 600 per display, Inter fino a 700 per UI

### F4. 🟡 Raggi di curvatura: da 14 valori a 3
- **Difetto**: 4/8/10/12/14/16/18/20/24/28px/1rem/999px tutti in uso.
- **Rimedio**: token in `@theme`: `--radius-sm: 10px` (input, chip), `--radius-md: 16px` (card, foto), `--radius-lg: 24px` (pannelli hero), `999px` solo per pill. Sostituzione globale.
- **File**: `src/styles.css` + tutti i `.css`.
- **Stato**: ☑ completato — `--radius-sm/md/lg` + pill

### F5. 🟡 Motion system unificato
- **Difetto**: transizioni 150/180/200/250/300ms con curve diverse, hover translateY(-1/-2/-3px) misti.
- **Rimedio**: token: `--ease: cubic-bezier(0.25,0.46,0.45,0.94)`, `--dur-fast: 160ms`, `--dur: 240ms`, `--dur-slow: 400ms`; hover lift standard -2px. Sostituire ovunque.
- **File**: `src/styles.css` + tutti i `.css`.
- **Stato**: ☑ completato — `--dur-fast/dur/dur-slow` e `--ease-brand`

---

## P. Sito pubblico

### P1. 🔴 Filigrana note musicali: renderla riconoscibile ma controllata
- **Difetto**: pattern tile 1024px su TUTTE le pagine con opacity 0.45 + contrast boost. Compete con le foto, annulla il whitespace, tile visibile su schermi grandi. È il difetto n°1 anti-Apple.
- **Rimedio scelto dopo feedback**: partitura globale mascherata verticalmente, 11% nel dark e
  7,5% nel light, senza contrast boost; secondo stemma grande a bassa opacità per dare personalità
  alle aree ariose senza sporcare le card.
- **File**: `src/app/features/main/layout/main-layout/main-layout.css` (`.shell::before`), eventuali equivalenti dashboard/login.
- **Stato**: ☑ completato e approvabile visivamente — filigrana leggibile, testi protetti dai pannelli glass

### P2. 🔴 Chiazze radiali oro/rosso nei pannelli page-header
- **Difetto**: i `radial-gradient` dentro `.pageHeader` (e simili in eventCta) appaiono come macchie giallo-verdi sfocate dietro ai titoli (visibile in Eventi/Contatti).
- **Rimedio**: sostituire con superficie piatta scura (`rgba(12,12,14,0.92)` + bordo sottile) o gradiente lineare monocromo appena percettibile. Niente riflessi radiali colorati.
- **File**: `src/app/features/main/components/page-header/page-header.css`, `home.css` (`.eventCta`), css che replicano il pattern.
- **Stato**: ☑ completato — superfici scure e riflessi ridotti

### P3. 🔴 Header rosso: superficie glass adattiva con accento
- **Difetto**: banda rossa satura sempre presente; sul tema scuro i saturi "vibrano" e competono con l'hero.
- **Rimedio**: header scuro semi-trasparente con blur (stile Apple), stemma + testo invariati, rosso mantenuto come accento (bordo inferiore sottile, stato attivo dei link, CTA). In home può partire trasparente sopra l'hero e scurirsi allo scroll.
- **File**: `main-layout.css` (`.header`), eventuale piccola logica scroll in `main-layout.ts`.
- **Stato**: ☑ completato — antracite nel dark, avorio nel light, rosso come accento

### P4. 🟡 Hero home: sfoltire gli elementi
- **Difetto**: stemma navbar + stemma hero + eyebrow + titolo + sottotitolo + 2 CTA + scroll indicator = troppi elementi centrati.
- **Rimedio**: togliere lo stemma grande dall'hero (già in navbar) o in alternativa togliere l'eyebrow-badge; max 4 elementi: titolo, sottotitolo, CTA primaria + secondaria.
- **File**: `home.html`, `home.css`.
- **Stato**: ☑ completato — rimosso lo stemma duplicato dalla hero

### P5. 🟡 Empty state curati (Galleria/Eventi)
- **Difetto**: riquadri vuoti anonimi quando non ci sono dati; in Galleria il mosaico resta un buco.
- **Rimedio**: componente empty-state condiviso (icona line-art coerente, titolo breve, sottotitolo, eventuale CTA "Seguici sui social"/"Contattaci"). Tab con contatore 0: nascondere il badge quando è 0.
- **File**: nuovo componente in `src/app/shared/components/`, uso in `gallery.html`, `events.html`.
- **Stato**: ☑ completato — componente condiviso, varianti neutral/error e CTA

### P6. 🟡 Scrim sotto i titoli overlay in Galleria
- **Difetto**: titolo bianco direttamente su foto chiara ("La sede - campanile").
- **Rimedio**: gradiente scuro dal basso (`linear-gradient(transparent, rgba(0,0,0,0.65))`) sotto il testo overlay.
- **File**: `gallery.css` (classi card/mosaico).
- **Stato**: ☑ completato

### P7. 🟡 Immagini: dimensioni esplicite e responsive
- **Difetto**: `<img>` senza `width`/`height` (layout shift) né `srcset` (2000px scaricati anche su mobile).
- **Rimedio**: aggiungere `width`/`height` intrinseci a tutte le foto statiche; valutare generazione varianti 800/1400/2000px + `srcset/sizes` (script sips in build o manuale).
- **File**: tutti gli html con `<img>` statiche; convenzione da documentare in CLAUDE.md.
- **Stato**: ☑ completato per gli asset statici; le immagini API restano dinamiche per definizione

### P8. 🟢 Footer di brand
- **Difetto**: footer anonimo (una riga + 4 link).
- **Rimedio**: blocco a 2-3 colonne: stemma piccolo + motto; colonne nav; social con icone SVG; riga legale sotto. Sobrio, niente decorazioni.
- **File**: `main-layout.html/.css`, chiavi i18n nuove nei 4 json.
- **Stato**: ☑ completato e tradotto in 4 lingue

### P9. 🔴 Bug copy/i18n trovati nell'audit (fix rapidi)
- `es.json`: `"Inscíbete / Contacto"` → **Inscríbete**; controllare anche `"Trombon"` → *Trombón*.
- `fr.json`: `"Flûte traversère"` → **traversière**.
- `index.html`: `lang="en"` → **`lang="it"`** (valutare aggiornamento dinamico al cambio lingua).
- **Stato**: ☑ completato; parità chiavi verificata

---

## D. Dashboard

### D1. 🔴 Sostituire `alert()`/`confirm()` nativi con UI coerente
- **Difetto**: popup di sistema per conferme eliminazione ed errori — rompono l'estetica.
- **Rimedio**: componente modale di conferma + toast/notifica riusabili (dark, token brand). Sostituire tutte le chiamate (`events-management.ts`, `gallery-management.ts`, `messages.ts`, ecc. — grep `confirm(`/`alert(`).
- **File**: nuovi componenti in `features/dashboard/components/`, refactor dei `.ts` elencati.
- **Stato**: ☑ completato — modale asincrona + toast, Escape e aria

### D2. 🔴 Icone SVG al posto delle emoji nelle action-card
- **Difetto**: emoji come icone in Overview (rendering diverso per OS, look amatoriale).
- **Rimedio**: sostituire con il set SVG stroke già usato altrove (calendar, image, mail, settings…).
- **File**: `overview.html`/`overview.ts`, `overview.css` (`.actionCard__icon`).
- **Stato**: ☑ completato

### D3. 🟡 Sistema di elevazione dark
- **Difetto**: tutte le superfici a `rgba(255,255,255,0.02-0.03)` piatte; nessuna distinzione card/dropdown/modale.
- **Rimedio**: 3 livelli superficie come token (`--surface-1/2/3` progressivamente più chiari) e applicarli: card=1, elementi sollevati/hover=2, modali/dropdown=3.
- **File**: `styles.css` + css dashboard.
- **Stato**: ☑ completato — tre livelli semantici

### D4. 🟡 Colori semantici tokenizzati + secondo indizio non-colore
- **Difetto**: dot attività con blu/verde Tailwind hardcoded; il colore è l'unico segnale (daltonici esclusi).
- **Rimedio**: token semantici (`--ok`, `--info`, `--warn`, `--danger`) coerenti col brand; affiancare icona o etichetta testuale al dot.
- **File**: `overview.css`, `activity-log.css/html`.
- **Stato**: ☑ completato — token più icona/etichetta

### D5. 🟡 Sfruttare la larghezza (overview max-width 1000px)
- **Difetto**: metà schermo vuoto a destra su monitor grandi.
- **Rimedio**: griglia fluida fino a ~1400px con colonne che si riflow-ano (stats 4-up, attività + azioni affiancate su large).
- **File**: `overview.css`.
- **Stato**: ☑ completato — griglia fluida fino ai monitor large

### D6. 🟢 Stat card con semantica di trend
- **Difetto**: trend in oro 11px senza direzione.
- **Rimedio**: freccia ↑/↓ + colore semantico (ok/danger) + taglia da scala F2; KPI più importanti per prime (inverted pyramid).
- **File**: `overview.html/.css/.ts`.
- **Stato**: ☑ completato

### D7. 🟢 Riconciliare l'identità header dashboard (oro) vs sito (rosso)
- **Difetto**: sembrano due prodotti diversi.
- **Rimedio**: decidere: (a) admin scuro neutro con accento oro (consigliato: distingue il contesto senza cambiare brand), oppure (b) stesso header del sito. Applicare a header + login.
- **File**: `dashboard-layout.css`, `login.css`.
- **Stato**: ☑ completato — dashboard neutra con accento oro

---

## Ordine di esecuzione consigliato

1. **P9** (fix copy — 10 minuti, zero rischio)
2. **F1 → F2 → F3** (token oro, scala tipo, gerarchia titoli — le fondamenta)
3. **P1 + P2** (filigrana e chiazze — massimo impatto percepito) ⚠️ conferma committente su P1
4. **F4 + F5** (raggi e motion — meccanici, dopo che F1-F3 hanno stabilito i token)
5. **P3 → P4** (header e hero) ⚠️ anteprima locale prima
6. **D1 + D2** (dashboard: modali e icone)
7. **P5, P6, P7, D3, D4, D5** (qualità diffusa)
8. **P8, D6, D7** (rifiniture)

## Regole trasversali per OGNI intervento
- Niente nuovi colori/valori hardcoded: solo token.
- i18n: ogni testo nuovo in 4 lingue con parità verificata.
- Verifica: `npx tsc --noEmit` + `npx ng build --configuration production` puliti + screenshot mobile (375px) / desktop (1280px) / large (1920px+).
- Mostrare in locale al committente prima di ogni push (richiesta esplicita).
- `prefers-reduced-motion` rispettato per ogni animazione nuova.
