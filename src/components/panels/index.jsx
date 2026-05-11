import { TONES, ALL_CHIPS, POSITIONS } from "../../constants/index.js";
import {
  SectionLabel, Field, ToggleRow, ToneButton,
  ColorPicker, inputCss, textareaCss, selectCss,
} from "../shared/index.jsx";

// ── IdentityPanel ─────────────────────────────────────────────
export function IdentityPanel({ config, h }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SectionLabel>Bot identity</SectionLabel>
      <Field label="Bot name">
        <input style={inputCss} value={config.botName} onChange={e => h.setBotName(e.target.value)} placeholder="Aria, Max, Zoe…" />
      </Field>
      <Field label="Company / Brand">
        <input style={inputCss} value={config.company} onChange={e => h.setCompany(e.target.value)} placeholder="Your company" />
      </Field>
      <Field label="Avatar emoji">
        <input style={{ ...inputCss, width: 64, textAlign: "center", fontSize: 20 }} value={config.avatar} onChange={e => h.setAvatar(e.target.value)} maxLength={2} />
      </Field>
      <SectionLabel style={{ marginTop: 4 }}>Messages</SectionLabel>
      <Field label="Welcome message">
        <textarea style={textareaCss} value={config.welcomeMsg} onChange={e => h.setWelcomeMsg(e.target.value)} />
      </Field>
      <Field label="Fallback message">
        <textarea style={{ ...textareaCss, minHeight: 56 }} value={config.fallbackMsg} onChange={e => h.setFallbackMsg(e.target.value)} />
      </Field>
    </div>
  );
}

// ── BehaviorPanel ─────────────────────────────────────────────
export function BehaviorPanel({ config, h }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SectionLabel>Personality tone</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
        {TONES.map(t => (
          <ToneButton key={t.value} {...t} selected={config.tone === t.value} onSelect={h.setTone} />
        ))}
      </div>

      <Field label="Custom instructions">
        <textarea
          style={{ ...textareaCss, minHeight: 60 }}
          value={config.personalityNote}
          onChange={e => h.setPersonalityNote(e.target.value)}
          placeholder="e.g. Always mention 30-day returns. Never discuss competitors."
        />
      </Field>

      <SectionLabel>Quick reply chips</SectionLabel>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {ALL_CHIPS.map(chip => {
          const on = config.activeChips.includes(chip);
          return (
            <button key={chip} onClick={() => h.toggleChip(chip)} style={{
              padding: "4px 10px", borderRadius: 20, fontSize: 11,
              fontFamily: "var(--font-sans)", cursor: "pointer", transition: "all 0.15s",
              fontWeight: on ? 600 : 400,
              border: `1.5px solid ${on ? "var(--accent)" : "var(--border)"}`,
              background: on ? "var(--accent-lt)" : "var(--bg)",
              color: on ? "var(--accent)" : "var(--ink-mid)",
            }}>{chip}</button>
          );
        })}
      </div>

      <SectionLabel style={{ marginTop: 4 }}>Options</SectionLabel>
      <ToggleRow label="Collect email before chat" checked={config.collectEmail} onChange={h.setCollectEmail} />
      <ToggleRow label="Show typing indicator"     checked={config.showTyping}   onChange={h.setShowTyping}   />

      <Field label="Human handoff keyword">
        <input style={inputCss} value={config.handoffTrigger} onChange={e => h.setHandoffTrigger(e.target.value)} placeholder="speak to agent" />
      </Field>
    </div>
  );
}

// ── KnowledgePanel ────────────────────────────────────────────
export function KnowledgePanel({ config, h }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SectionLabel>Q&amp;A pairs ({config.qaItems.length})</SectionLabel>

      {config.qaItems.map(item => (
        <div key={item.id} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "10px 12px" }}>
          <input
            style={{ ...inputCss, marginBottom: 6 }}
            value={item.q}
            onChange={e => h.updateQAQuestion(item.id, e.target.value)}
            placeholder="Question"
          />
          <textarea
            style={{ ...textareaCss, minHeight: 52, marginBottom: 6 }}
            value={item.a}
            onChange={e => h.updateQAAnswer(item.id, e.target.value)}
            placeholder="Answer"
          />
          <button onClick={() => h.removeQA(item.id)} style={{ fontSize: 11, color: "var(--red)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            ✕ Remove
          </button>
        </div>
      ))}

      <button onClick={h.addQA} style={{
        padding: 8, borderRadius: "var(--radius-md)",
        border: "1.5px dashed var(--border)", background: "transparent",
        color: "var(--accent)", fontSize: 12, cursor: "pointer",
        fontWeight: 600, fontFamily: "var(--font-sans)",
      }}>+ Add Q&amp;A pair</button>

      <SectionLabel style={{ marginTop: 4 }}>Business context</SectionLabel>
      <textarea
        style={{ ...textareaCss, minHeight: 80 }}
        value={config.bizContext}
        onChange={e => h.setBizContext(e.target.value)}
        placeholder="Describe your business, products, support hours, policies…"
      />
    </div>
  );
}

// ── StylePanel ────────────────────────────────────────────────
export function StylePanel({ config, h }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SectionLabel>Colors</SectionLabel>
      <Field label="Header & buttons">
        <ColorPicker value={config.primaryColor} onChange={h.setPrimaryColor} />
      </Field>
      <Field label="User bubble">
        <ColorPicker value={config.userColor} onChange={h.setUserColor} />
      </Field>

      <Field label={`Border radius — ${config.chatRadius}px`}>
        <input type="range" min={0} max={28} value={config.chatRadius}
          onChange={e => h.setChatRadius(+e.target.value)}
          style={{ width: "100%", accentColor: "var(--accent)" }} />
      </Field>

      <Field label="Widget position">
        <select style={selectCss} value={config.position} onChange={e => h.setPosition(e.target.value)}>
          {POSITIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>
      </Field>
    </div>
  );
}
