/**
 * A single message turn in the chat preview.
 */
export class ChatMessage {
  constructor({ role, text, time = null }) {
    this.id   = `msg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    this.role = role; // "bot" | "user"
    this.text = text;
    this.time = time ?? new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    Object.freeze(this);
  }

  get isBot()  { return this.role === "bot";  }
  get isUser() { return this.role === "user"; }

  /** Convert to the Anthropic API format. */
  toAPIMessage() {
    return { role: this.isBot ? "assistant" : "user", content: this.text };
  }

  static bot(text)  { return new ChatMessage({ role: "bot",  text }); }
  static user(text) { return new ChatMessage({ role: "user", text }); }
}
