# LookBook Smart Pricing AI

Applicazione web basata su Intelligenza Artificiale per la valutazione del prezzo di vendita di capi di abbigliamento second-hand.

Progetto finale del percorso **Agent AI per lo sviluppo — start2impact**.

## 1. Descrizione

LookBook Smart Pricing AI permette all'utente di caricare la fotografia di un capo di abbigliamento e specificarne le caratteristiche principali.

Attraverso un modello linguistico multimodale, l'applicazione genera:

- Un prezzo di vendita consigliato.
- Un intervallo di prezzo minimo e massimo.
- Una motivazione della valutazione.
- Tre suggerimenti per migliorare le possibilità di vendita.

Le valutazioni vengono salvate in PostgreSQL.

Le stime sono indicative e non costituiscono quotazioni di mercato verificate.

## 2. Tecnologie utilizzate

| Livello | Tecnologia |
|---|---|
| Frontend | Vue 3, Vite, JavaScript |
| Backend | Node.js, Express |
| Intelligenza Artificiale | Groq API, modello multimodale configurabile |
| Database | PostgreSQL |
| Comunicazione | REST API, JSON, multipart/form-data |

## 3. Architettura

L'applicazione utilizza un'architettura client-server.

1. L'utente carica un'immagine e inserisce categoria, brand e stato del capo.
2. Vue invia i dati al backend Express.
3. Il backend valida le informazioni e prepara la richiesta multimodale.
4. Groq elabora la fotografia e i dati del capo.
5. Il backend valida la risposta AI e salva la valutazione in PostgreSQL.
6. Il frontend visualizza prezzo, range, motivazione e consigli.

La logica AI, la gestione HTTP e la persistenza sono separate in moduli dedicati.

## 4. Struttura del progetto

```text
lookbook-smart-pricing-ai/
├── backend/
│   ├── database/
│   │   └── migrations/
│   │       └── 001_initial_schema.sql
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── prompts/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── validators/
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── utils/
│   │   └── App.vue
│   └── package.json
├── .gitignore
└── README.md
```

## 5. Requisiti per l'esecuzione

- Node.js e npm.
- PostgreSQL.
- Una chiave API Groq.
- Un modello Groq multimodale compatibile con l'analisi delle immagini.

## 6. Configurazione del database

Creare un database PostgreSQL, ad esempio:

```sql
CREATE DATABASE lookbook_smart_pricing;
```

Eseguire successivamente lo script:

```text
backend/database/migrations/001_initial_schema.sql
```

Lo script crea la tabella `evaluations`, utilizzata per conservare le valutazioni AI.

L'utente PostgreSQL configurato nel backend deve disporre dei permessi necessari per connettersi al database e inserire record nella tabella.

## 7. Configurazione del backend

Entrare nella directory:

```bash
cd backend
```

Installare le dipendenze:

```bash
npm ci
```

Creare un file `.env` a partire da `.env.example`.

Configurare le variabili:

```dotenv
PORT=3000
NODE_ENV=development

GROQ_API_KEY=
GROQ_MODEL=qwen/qwen3.8-27b
GROQ_TIMEOUT_MS=30000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=lookbook_smart_pricing
DB_USER=lookbook_app
DB_PASSWORD=
DB_POOL_MAX=10
```

Inserire i valori effettivi di `GROQ_API_KEY`, `DB_USER` e `DB_PASSWORD`.

Non pubblicare il file `.env` nel repository.

Avviare il backend:

```bash
npm run dev
```

Per l'avvio senza modalità di sviluppo:

```bash
npm start
```

Il backend utilizza normalmente la porta `3000`.

## 8. Configurazione del frontend

Aprire un secondo terminale ed entrare nella directory:

```bash
cd frontend
```

Installare le dipendenze:

```bash
npm ci
```

Avviare Vite:

```bash
npm run dev
```

Aprire nel browser l'indirizzo indicato dal terminale, normalmente:

```text
http://localhost:5173
```

Durante lo sviluppo, Vite inoltra le richieste `/api` al backend Express.

## 9. API REST

### POST /api/evaluate

Riceve una richiesta `multipart/form-data` con i campi:

| Campo | Descrizione |
|---|---|
| `image` | Fotografia del capo |
| `category` | Categoria |
| `brand` | Marca |
| `condition` | Stato: nuovo, buono oppure usato |

Esempio di risposta:

```json
{
  "suggested_price": 22,
  "range": {
    "min": 18,
    "max": 27
  },
  "motivation": "Motivazione generata dal modello AI.",
  "selling_tips": [
    "Utilizzare fotografie ben illuminate.",
    "Descrivere accuratamente le condizioni.",
    "Indicare le misure del capo."
  ]
}
```

### GET /api/health

Restituisce lo stato del servizio backend.

## 10. System prompt e modello AI

Il backend utilizza un system prompt dedicato alla valutazione di capi second-hand.

Il modello considera le caratteristiche del capo e restituisce una valutazione strutturata in JSON.

Il prompt è definito nel file:

```text
backend/src/prompts/evaluationSystemPrompt.js
```

L'immagine viene trasmessa al modello attraverso una rappresentazione base64.

Le risposte sono sottoposte a validazione prima di essere restituite al frontend.

## 11. Persistenza

Ogni valutazione completata viene salvata nella tabella PostgreSQL `evaluations`.

I dati memorizzati comprendono:

- Categoria, brand e stato.
- Prezzo suggerito e intervallo.
- Motivazione e suggerimenti.
- Modello AI e versione del prompt.
- Data e ora della valutazione.

## 12. Limitazioni

- I prezzi sono stime generate da un modello AI.
- Non è prevista un'integrazione con quotazioni di mercato in tempo reale.
- La qualità della valutazione dipende dalle informazioni fornite e dalla fotografia.
- L'applicazione rappresenta un prototipo didattico, non un servizio commerciale di valutazione certificata.

## 13. Deploy

Il progetto è predisposto per la distribuzione separata di frontend e backend.

Il frontend può essere pubblicato su un servizio di hosting statico, mentre il backend richiede un ambiente Node.js e un database PostgreSQL raggiungibile.

Gli indirizzi pubblici e le configurazioni definitive saranno documentati dopo il deploy.

## 14. Obiettivo del progetto

Dimostrare l'integrazione end-to-end tra interfaccia Vue, backend Express, modello AI multimodale e database PostgreSQL, attraverso un caso d'uso concreto legato alla moda second-hand.