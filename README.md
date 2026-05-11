# JavoBot — AI Customer Support Chatbot Builder

A production-ready, OOP React application for building, configuring, and deploying AI-powered customer support chatbots. Powered by the Ilkin Javadov Groq API or Anthropic Claude AI

## Architecture

```
src/
├── constants/          # App-wide enums, defaults, config values
│   └── index.js
├── models/             # OOP domain models (immutable, serializable)
│   ├── BotConfig.js    # Full chatbot configuration (all fields, QA helpers)
│   ├── QAEntry.js      # Single knowledge-base Q&A pair
│   └── ChatMessage.js  # Single chat turn (UI + API format)
├── services/           # Singleton service classes (no UI, pure logic)
│   ├── StorageService.js     # localStorage read/write + import/export
│   ├── AnthropicService.js   # Anthropic API wrapper + system prompt builder
│   └── EmbedCodeGenerator.js # Snippet generation + export prompts
├── hooks/              # React custom hooks (state + effects)
│   ├── useBots.js      # Bot list CRUD, active selection, persistence
│   ├── useBotConfig.js # Typed setters for every BotConfig field
│   ├── useChat.js      # Live conversation state + API calls
│   └── useClipboard.js # One-shot clipboard copy with feedback
├── components/
│   ├── shared/         # Design-system primitives (Toggle, Field, Buttons…)
│   ├── layout/         # App chrome (Topbar, BotList sidebar)
│   ├── panels/         # Config tab panels (Identity/Behavior/Knowledge/Style)
│   ├── chat/           # Live chat preview window
│   └── export/         # Embed snippet + export actions panel
├── styles/
│   └── global.css      # CSS reset + design tokens (CSS custom properties)
├── App.jsx             # Root component — wires hooks to layout, no logic
└── main.jsx            # React 18 entry point
```

## Storage strategy: localStorage + JSON export

**Why no database?**

| Need                  | Solution                                      |
|-----------------------|-----------------------------------------------|
| Persist bot configs   | `localStorage` via `StorageService`           |
| Backup / portability  | Export single bot or all bots as `.json`      |
| Share with client     | Hand them the `.json` — they import it        |
| Cross-device sync     | Not needed for freelance deliverables         |
| Multi-user/SaaS       | Add Supabase later (schema already JSON-safe) |

Bots are stored under `botforge:bots` as a versioned JSON envelope. The `BotConfig.toJSON()` / `BotConfig.fromJSON()` round-trip is tested and stable.

## Key OOP patterns

### Immutable models
`BotConfig` and `QAEntry` use `Object.freeze()`. Every setter returns a new instance — safe as React state with no accidental mutations.

```js
// BotConfig mutation example
const updated = config
  .with({ botName: "Max" })
  .addQA()
  .toggleChip("Pricing");
```

### Service singletons
`AnthropicService`, `StorageService`, and `EmbedCodeGenerator` are instantiated once and exported as singletons. Import the instance, not the class:

```js
import { anthropicService } from "@/services/AnthropicService.js";
```

### Hook composition
`App.jsx` composes three hooks that each own a clean slice of state:

```
useBots()       → bot list, active bot, CRUD, import/export
useBotConfig()  → typed setters for the active bot's config
useChat()       → messages, typing state, API calls
```

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build → dist/
npm run preview   # preview the build
```

## Deployment

**Zero-cost static hosting:**
```bash
npm run build
# Upload dist/ to Vercel, Netlify, or GitHub Pages
```

**Vercel (recommended):**
```bash
npm i -g vercel
vercel --prod
```

The Groq API key is passed through the browser directly. For production client deployments, proxy the API through a serverless function (Vercel Edge Functions / Netlify Functions) to keep the key server-side.

## Upgrading to multi-user (Supabase)

When a client needs accounts / cross-device sync, the migration is minimal:

1. Replace `StorageService` with a `SupabaseService` that calls `supabase.from("bots").upsert(bot.toJSON())`
2. Add `supabase.auth.signInWithOAuth()` in `Topbar`
3. `BotConfig.fromJSON()` already handles the deserialization — no model changes

The rest of the app is unchanged.


