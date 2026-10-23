# LookBook Smart Pricing AI

An AI-powered web application that estimates resale prices for second-hand clothing from a garment photo and a few descriptive details.

**Final project — start2impact, AI Agents for Development course.**

## Overview

LookBook Smart Pricing AI helps users estimate a suitable listing price for a second-hand garment. Users upload a photo and provide its category, brand, and condition. A multimodal AI model returns:

- A suggested selling price in euros
- A minimum and maximum price range
- An explanation of the estimate
- Three practical tips to improve the listing

Completed evaluations are stored in PostgreSQL. Estimates are indicative AI-generated suggestions, **not verified real-time market valuations**.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | Vue 3, Vite, JavaScript |
| Backend | Node.js, Express |
| AI | Groq API and a configurable vision-capable model |
| Database | PostgreSQL |
| Communication | REST API, JSON, multipart/form-data |

## Architecture

```text
User
  |
  v
Vue 3 frontend
  |  Photo + garment details
  v
Express backend
  |-- Input validation
  |-- Multimodal request -> Groq API
  |-- AI response validation
  |-- Save evaluation -> PostgreSQL
  v
JSON response -> Vue result display
```

The backend separates routing, controllers, validation, AI prompts and services, and database access into dedicated modules.

## Project Structure

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

## Prerequisites

- Node.js and npm
- PostgreSQL
- A Groq API key
- Access to a Groq model that supports image input

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/giacorsa/lookbook-smart-pricing-ai.git
cd lookbook-smart-pricing-ai
```

### 2. Configure PostgreSQL

Create a database, for example:

```sql
CREATE DATABASE lookbook_smart_pricing;
```

Run `backend/database/migrations/001_initial_schema.sql` against that database. For example, with the PostgreSQL command-line client:

```bash
psql -U postgres -d lookbook_smart_pricing -f backend/database/migrations/001_initial_schema.sql
```

Configure a PostgreSQL account with permission to connect to the database and insert records into the `evaluations` table. The database username and password must match the backend environment variables.

### 3. Configure and start the backend

```bash
cd backend
npm ci
```

Copy `.env.example` to `.env` and configure the values:

```dotenv
PORT=3000
NODE_ENV=development

GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=your_vision_capable_groq_model
GROQ_TIMEOUT_MS=30000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=lookbook_smart_pricing
DB_USER=lookbook_app
DB_PASSWORD=your_database_password
DB_POOL_MAX=10
```

Use a Groq model identifier that is available to your account and supports image input. The repository's `.env.example` provides the project's configured default; confirm that it is currently supported before running the application.

Start the backend:

```bash
npm run dev
```

The default backend URL is `http://localhost:3000`.

### 4. Configure and start the frontend

Open a second terminal in the repository root:

```bash
cd frontend
npm ci
npm run dev
```

Open the URL displayed by Vite (typically `http://localhost:5173`). The Vite development configuration routes `/api` requests to the backend.

## Using the Application

1. Upload a clear photo of a garment.
2. Enter its category and brand.
3. Select its condition: `nuovo` (new), `buono` (good), or `usato` (used).
4. Select **Valuta il capo** to request an AI estimate.
5. Review the suggested price, price range, explanation, and selling tips.

The user interface and generated evaluation text are currently in Italian.

## API

### `POST /api/evaluate`

Accepts a `multipart/form-data` request containing the garment photo and descriptive fields.

| Field | Description |
| --- | --- |
| `image` | Garment photo |
| `category` | Garment category |
| `brand` | Brand name |
| `condition` | `nuovo`, `buono`, or `usato` |

Example evaluation payload (illustrative values):

```json
{
  "suggested_price": 15,
  "range": {
    "min": 10,
    "max": 20
  },
  "motivation": "The suggested price reflects the garment's stated condition and visible characteristics.",
  "selling_tips": [
    "Include a clear photo of the size and fabric label.",
    "Show close-up photos of seams and closures.",
    "List accurate garment measurements."
  ]
}
```

### `GET /api/health`

Returns the backend service status.

## AI Integration

The backend prepares a multimodal request combining the garment details with the uploaded image, represented as base64. A dedicated system prompt guides the model to produce a structured price recommendation and selling advice.

The active prompt is maintained in:

```text
backend/src/prompts/evaluationSystemPrompt.js
```

The AI response is validated before being returned to the frontend.

## PostgreSQL Persistence

Successful evaluations are stored in the `evaluations` table, including:

- Garment category, brand, and condition
- Suggested, minimum, and maximum prices
- Explanation and three selling tips
- AI model name and prompt version
- Creation timestamp

The schema for new installations is defined in `backend/database/migrations/001_initial_schema.sql`.

## Limitations

- Prices are estimates generated by AI, not guaranteed resale values.
- The application does not query live marketplace listings or market prices.
- Image quality and the accuracy of the supplied garment details affect results.
- This is an educational prototype, not a certified appraisal service.

## Deployment

The frontend and backend can be deployed separately. The frontend can run on static hosting, while the backend requires a Node.js runtime, access to the Groq API, and a reachable PostgreSQL database.

Public deployment details will be added after deployment is completed.

## Project Goal

Demonstrate an end-to-end integration of a Vue interface, an Express API, a multimodal AI model accessed through Groq, and PostgreSQL persistence for a practical second-hand fashion use case.

## Security Notes

Keep API keys and database passwords in local environment variables or your hosting provider's secret manager. Never commit `.env` files or credentials to the repository.
