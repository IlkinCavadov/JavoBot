/**
 * A single question-answer pair in the bot's knowledge base.
 * Immutable — all mutations return new instances.
 */
export class QAEntry {
  constructor({ id = null, q = "", a = "" } = {}) {
    this.id = id ?? `qa_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    this.q  = q;
    this.a  = a;
    Object.freeze(this);
  }

  withQuestion(q) { return new QAEntry({ ...this, q }); }
  withAnswer(a)   { return new QAEntry({ ...this, a }); }

  toPromptString() {
    return `Q: ${this.q}\nA: ${this.a}`;
  }

  isValid() {
    return this.q.trim().length > 0 && this.a.trim().length > 0;
  }

  toJSON() {
    return { id: this.id, q: this.q, a: this.a };
  }

  static fromJSON(raw) {
    return new QAEntry({ id: raw.id, q: raw.q ?? "", a: raw.a ?? "" });
  }
}
