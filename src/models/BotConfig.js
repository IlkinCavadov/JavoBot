import { QAEntry }   from "./QAEntry.js";
import { DEFAULT_QA } from "../constants/index.js";

/**
 * Complete, immutable configuration for a single chatbot.
 * All setters return new instances — safe to use as React state.
 */
export class BotConfig {
  constructor({
    id           = null,
    createdAt    = null,
    updatedAt    = null,
    // Identity
    botName      = "Aria",
    company      = "Acme Inc.",
    avatar       = "✨",
    welcomeMsg   = "Hi there! I'm Aria, your support assistant 👋 How can I help?",
    fallbackMsg  = "I'm not sure about that — let me connect you with a human agent!",
    // Behavior
    tone            = "friendly",
    personalityNote = "",
    handoffTrigger  = "speak to agent",
    collectEmail    = false,
    showTyping      = true,
    activeChips     = ["Track my order", "Return policy", "Contact support"],
    // Knowledge
    qaItems    = DEFAULT_QA.map(d => new QAEntry(d)),
    bizContext = "",
    // Style
    primaryColor = "#5B4FE8",
    userColor    = "#3D33B5",
    chatRadius   = 20,
    position     = "bottom-right",
  } = {}) {
    this.id          = id       ?? `bot_${Date.now()}`;
    this.createdAt   = createdAt ?? new Date().toISOString();
    this.updatedAt   = updatedAt ?? new Date().toISOString();
    this.botName     = botName;
    this.company     = company;
    this.avatar      = avatar;
    this.welcomeMsg  = welcomeMsg;
    this.fallbackMsg = fallbackMsg;
    this.tone            = tone;
    this.personalityNote = personalityNote;
    this.handoffTrigger  = handoffTrigger;
    this.collectEmail    = collectEmail;
    this.showTyping      = showTyping;
    this.activeChips     = activeChips;
    this.qaItems    = qaItems;
    this.bizContext = bizContext;
    this.primaryColor = primaryColor;
    this.userColor    = userColor;
    this.chatRadius   = chatRadius;
    this.position     = position;
    Object.freeze(this);
  }

  /** Return a new config with patched fields + updated timestamp. */
  with(patch) {
    return new BotConfig({ ...this, ...patch, updatedAt: new Date().toISOString() });
  }

  // ── QA helpers ────────────────────────────────────────────────────────────

  addQA() {
    return this.with({ qaItems: [...this.qaItems, new QAEntry()] });
  }

  removeQA(id) {
    return this.with({ qaItems: this.qaItems.filter(e => e.id !== id) });
  }

  updateQAQuestion(id, q) {
    return this.with({ qaItems: this.qaItems.map(e => e.id === id ? e.withQuestion(q) : e) });
  }

  updateQAAnswer(id, a) {
    return this.with({ qaItems: this.qaItems.map(e => e.id === id ? e.withAnswer(a) : e) });
  }

  // ── Chip helpers ──────────────────────────────────────────────────────────

  toggleChip(chip) {
    const chips = this.activeChips.includes(chip)
      ? this.activeChips.filter(c => c !== chip)
      : [...this.activeChips, chip];
    return this.with({ activeChips: chips });
  }

  // ── Serialization ─────────────────────────────────────────────────────────

  toJSON() {
    return {
      id: this.id, createdAt: this.createdAt, updatedAt: this.updatedAt,
      botName: this.botName, company: this.company, avatar: this.avatar,
      welcomeMsg: this.welcomeMsg, fallbackMsg: this.fallbackMsg,
      tone: this.tone, personalityNote: this.personalityNote,
      handoffTrigger: this.handoffTrigger, collectEmail: this.collectEmail,
      showTyping: this.showTyping, activeChips: [...this.activeChips],
      qaItems: this.qaItems.map(e => e.toJSON()),
      bizContext: this.bizContext,
      primaryColor: this.primaryColor, userColor: this.userColor,
      chatRadius: this.chatRadius, position: this.position,
    };
  }

  static fromJSON(raw) {
    return new BotConfig({
      ...raw,
      qaItems: (raw.qaItems ?? []).map(QAEntry.fromJSON),
    });
  }

  /** Human-readable label for the bot list sidebar. */
  get displayName() {
    return `${this.avatar} ${this.botName}`;
  }

  get shortDescription() {
    return this.company;
  }
}
