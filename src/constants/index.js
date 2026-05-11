// ── API ───────────────────────────────────────────────────────
//export const API_URL  = "/api/groq/openai/v1/chat/completions";
export const API_URL = import.meta.env.DEV
  ? "/api/groq/openai/v1/chat/completions"
  : "/api/groq";
export const AI_MODEL = "llama-3.3-70b-versatile";
export const MAX_TOKENS = 1000;

// ── Storage ───────────────────────────────────────────────────
export const STORAGE_KEY    = "botforge:bots";
export const ACTIVE_BOT_KEY = "botforge:activeBot";

// ── Tone options ──────────────────────────────────────────────
export const TONES = [
  { value: "friendly",     label: "Friendly",     emoji: "😊" },
  { value: "professional", label: "Professional",  emoji: "👔" },
  { value: "playful",      label: "Playful",       emoji: "🎉" },
  { value: "concise",      label: "Concise",       emoji: "⚡" },
];

export const TONE_DESCRIPTIONS = {
  friendly:     "warm, friendly and approachable",
  professional: "professional and formal",
  playful:      "playful and fun with light humor",
  concise:      "very concise and direct — max 2 sentences",
};

// ── Available quick-reply chips ───────────────────────────────
export const ALL_CHIPS = [
  "Track my order",
  "Return policy",
  "Contact support",
  "Business hours",
  "Pricing",
  "Book a demo",
];

// ── Widget position options ───────────────────────────────────
export const POSITIONS = [
  { value: "bottom-right", label: "Bottom right" },
  { value: "bottom-left",  label: "Bottom left"  },
  { value: "center",       label: "Centered"      },
];

// ── Config panel tabs ─────────────────────────────────────────
export const TABS = [
  { key: "identity",  label: "Identity"  },
  { key: "behavior",  label: "Behavior"  },
  { key: "knowledge", label: "Knowledge" },
  { key: "style",     label: "Style"     },
];

// ── Default Q&A seed data ─────────────────────────────────────
export const DEFAULT_QA = [
  { q: "What are your shipping times?",  a: "We ship within 1–3 business days. Standard delivery takes 5–7 days." },
  { q: "How do I return an item?",       a: "You can return any item within 30 days. Visit our returns portal for help!" },
  { q: "Do you offer bulk discounts?",   a: "Yes! Orders over 50 units get 15% off. Email sales@acme.com." },
];

// ── App metadata ──────────────────────────────────────────────
export const APP_NAME    = "JavoBot";
export const APP_VERSION = "1.0.0";
