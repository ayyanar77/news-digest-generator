# Automated News Digest Generator

Fetches top headlines from [NewsAPI](https://newsapi.org) across several
categories, removes duplicate stories, and builds a clean, card-based HTML
digest you can open in any browser.

## Setup

1. Install [Node.js 18+](https://nodejs.org) and confirm:
   ```
   node --version
   npm --version
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Get a free API key at https://newsapi.org/register
4. Copy the example config and add your key:
   ```
   cp config.json.example config.json
   ```
   Then edit `config.json` and replace `YOUR_API_KEY`.

## Run

```
npm run dev      # runs directly with ts-node
npm run build    # compiles TypeScript -> dist/
npm start        # builds, then runs the compiled JS
npm test         # runs the Jest test suite
```

Open `output/digest.html` in your browser after a successful run.

## Project structure

```
src/
├── api/NewsClient.ts        # talks to NewsAPI over HTTP (Axios)
├── builders/HTMLBuilder.ts  # builds the styled HTML page (Builder pattern)
├── services/ConfigService.ts# loads/validates config.json (Singleton pattern)
├── types/index.ts           # shared TypeScript interfaces
├── utils/deduplicate.ts     # URL-normalizing duplicate removal
├── utils/fileWriter.ts      # writes output, creating folders as needed
├── utils/logger.ts          # leveled console logging
└── index.ts                 # wires everything together
tests/                       # Jest unit tests
```

## Data flow

```
config.json → ConfigService → NewsClient → NewsAPI
   → deduplicate → HTMLBuilder → output/digest.html
```
