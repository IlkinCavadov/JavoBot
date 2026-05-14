import { API_URL, AI_MODEL, MAX_TOKENS, TONE_DESCRIPTIONS } from "../constants/index.js";

/**
 * Wraps the Anthropic Messages API.
 * Responsible for prompt construction and API communication only.
 */

export class AnthropicService {
  constructor({ model = AI_MODEL, maxTokens = MAX_TOKENS } = {}) {
    this.model     = model;
    this.maxTokens = maxTokens;
  }

  /**
   * Build a system prompt from a BotConfig.
   * @param {import("../models/BotConfig.js").BotConfig} config
   */
  buildSystemPrompt(config) {
    const tone    = TONE_DESCRIPTIONS[config.tone] ?? "helpful";
    const qaBlock = config.qaItems
      .filter(e => e.isValid())
      .map(e => e.toPromptString())
      .join("\n\n");

    const parts = [`You are ${config.botName}, a customer support AI for ${config.company}. Be ${tone}.`];

    if (config.bizContext.trim()) parts.push(`\nBusiness context:\n${config.bizContext}`);
    if (qaBlock)                  parts.push(`\nKnowledge base:\n${qaBlock}`);
    if (config.personalityNote)   parts.push(`\nAdditional instructions:\n${config.personalityNote}`);

    parts.push(`\nWhen you don't know the answer, say: "${config.fallbackMsg}"`);
    parts.push("Keep every reply to 1–3 sentences. Never invent facts.");

    return parts.join("\n");
  }

  /**
   * Send a chat turn and return the assistant's reply text.
   * @param {import("../models/BotConfig.js").BotConfig} config
   * @param {Array<{role:string,content:string}>} history  API-format history
   * @returns {Promise<string>}
   */
 async chat(config, history) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(import.meta.env.DEV && {
        "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
      }),
    },
    body: JSON.stringify({
      model:      AI_MODEL,
      max_tokens: MAX_TOKENS,
      messages: [
        { role: "system", content: this.buildSystemPrompt(config) },
        ...history,
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? `API error ${res.status}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error("Empty response from API.");
  return text;
}
}

export const anthropicService = new AnthropicService();
