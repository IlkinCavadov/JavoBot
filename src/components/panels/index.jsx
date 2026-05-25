

import { use } from "react";
import { useState } from "react";
import { TONES, ALL_CHIPS, POSITIONS } from "../../constants/index.js";
import {
  SectionLabel, Field, ToggleRow, ToneButton,
  ColorPicker, inputCss, textareaCss, selectCss,
} from "../shared/index.jsx";


import {useTranslation} from "react-i18next";
// ── IdentityPanel ─────────────────────────────────────────────
export function IdentityPanel({ config, h }) {
  const { t } = useTranslation();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SectionLabel>{t("botIdentity")}</SectionLabel>
      <Field label={t("botName")}>
        <input style={inputCss} value={config.botName} onChange={e => h.setBotName(e.target.value)} placeholder="Aria, Max, Zoe…" />
      </Field>
      <Field label={t("companyBrand")}>
        <input style={inputCss} value={config.company} onChange={e => h.setCompany(e.target.value)} placeholder="Your company" />
      </Field>
      <Field label={t("avatarEmoji")}>
        <input style={{ ...inputCss, width: 64, textAlign: "center", fontSize: 20 }} value={config.avatar} onChange={e => h.setAvatar(e.target.value)} maxLength={2} />
      </Field>
      <SectionLabel style={{ marginTop: 4 }}>{t("messages")}</SectionLabel>
      <Field label={t("welcomeMessage")}>
        <textarea style={textareaCss} value={config.welcomeMsg} onChange={e => h.setWelcomeMsg(e.target.value)} />
      </Field>
      <Field label={t("fallbackMessage")}>
        <textarea style={{ ...textareaCss, minHeight: 56 }} value={config.fallbackMsg} onChange={e => h.setFallbackMsg(e.target.value)} />
      </Field>
    </div>
  );
}

// ── BehaviorPanel ─────────────────────────────────────────────
export function BehaviorPanel({ config, h }) {
  const { t } = useTranslation();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SectionLabel>{t("personalityTone")}</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
        {TONES.map(t => (
          <ToneButton key={t.value} {...t} selected={config.tone === t.value} onSelect={h.setTone} />
        ))}
      </div>

      <Field label={t("customInstructions")}>
        <textarea
          style={{ ...textareaCss, minHeight: 60 }}
          value={config.personalityNote}
          onChange={e => h.setPersonalityNote(e.target.value)}
          placeholder="e.g. Always mention 30-day returns. Never discuss competitors."
        />
      </Field>

      <SectionLabel>{t("quickReplyChips")}</SectionLabel>
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

      <SectionLabel style={{ marginTop: 4 }}>{t("options")}</SectionLabel>
      <ToggleRow label={t("collectEmail")} checked={config.collectEmail} onChange={h.setCollectEmail} />
      <ToggleRow label={t("showTyping")} checked={config.showTyping} onChange={h.setShowTyping} />

      <Field label={t("humanHandoffKeyword")}>
        <input style={inputCss} value={config.handoffTrigger} onChange={e => h.setHandoffTrigger(e.target.value)} placeholder="speak to agent" />
      </Field>
    </div>
  );
}

// ── KnowledgePanel ────────────────────────────────────────────
export function KnowledgePanel({ config, h }) {
  const { t } = useTranslation();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SectionLabel>{t("qaPairs")} ({config.qaItems.length})</SectionLabel>

      {config.qaItems.map(item => (
        <div key={item.id} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "10px 12px" }}>
          <input
            style={{ ...inputCss, marginBottom: 6 }}
            value={item.q}
            onChange={e => h.updateQAQuestion(item.id, e.target.value)}
            placeholder={t("question")}
          />
          <textarea
            style={{ ...textareaCss, minHeight: 52, marginBottom: 6 }}
            value={item.a}
            onChange={e => h.updateQAAnswer(item.id, e.target.value)}
            placeholder={t("answer")}
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

      <SectionLabel style={{ marginTop: 4 }}>{t("businessContext")}</SectionLabel>
      <textarea
        style={{ ...textareaCss, minHeight: 80 }}
        value={config.bizContext}
        onChange={e => h.setBizContext(e.target.value)}
        placeholder={t("businessContext")}
      />
    </div>
  );
}

// ── StylePanel ────────────────────────────────────────────────
export function StylePanel({ config, h }) {
  const { t } = useTranslation();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SectionLabel>{t("colors")}</SectionLabel>
      <Field label={t("headerButtons")}>
        <ColorPicker value={config.primaryColor} onChange={h.setPrimaryColor} />
      </Field>
      <Field label={t("userBubble")}>
        <ColorPicker value={config.userColor} onChange={h.setUserColor} />
      </Field>

      <Field label={`Border radius — ${config.chatRadius}px`}>
        <input type="range" min={0} max={28} value={config.chatRadius}
          onChange={e => h.setChatRadius(+e.target.value)}
          style={{ width: "100%", accentColor: "var(--accent)" }} />
      </Field>

      <Field label={t("widgetPosition")}>
        <select style={selectCss} value={config.position} onChange={e => h.setPosition(e.target.value)}>
          {POSITIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>
      </Field>
    </div>
  );
}

export function BotList({ bots = [], activeId, onSelect, onDuplicate, onDelete, onExport, config, h }) {
  console.log({ bots, activeId, onSelect, onDuplicate, onDelete, onExport });
  const [menuId, setMenuId] = useState(null);
 

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: "10px 0" }}>
      {bots.map(bot => (
        <div key={bot.id} style={{ position: "relative" }}>
          <div
            onClick={() => { onSelect(bot.id); setMenuId(null); }}
            style={{
              padding: "10px 12px", cursor: "pointer", transition: "background 0.1s",
              background: bot.id === activeId ? "var(--accent-lt)" : "transparent",
              borderLeft: `3px solid ${bot.id === activeId ? "var(--accent)" : "transparent"}`,
              display: "flex", alignItems: "center", gap: 8,
            }}
            onMouseEnter={e => { if (bot.id !== activeId) e.currentTarget.style.background = "var(--bg)"; }}
            onMouseLeave={e => { if (bot.id !== activeId) e.currentTarget.style.background = "transparent"; }}
          >
            <span style={{ fontSize: 18, flexShrink: 0 }}>{bot.avatar}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: bot.id === activeId ? "var(--accent)" : "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {bot.botName}
              </div>
              <div style={{ fontSize: 11, color: "var(--ink-faint)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {bot.company}
              </div>
            </div>

            {/* Context menu trigger */}
            <button
              onClick={e => { e.stopPropagation(); setMenuId(menuId === bot.id ? null : bot.id); }}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-faint)", fontSize: 16, padding: "0 2px", lineHeight: 1, flexShrink: 0 }}
            >⋯</button>
          </div>

          {/* Context menu */}
          {menuId === bot.id && (
            <div style={{
              position: "absolute", right: 8, top: "100%", zIndex: 100,
              background: "var(--bg-card)", border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-md)",
              overflow: "hidden", minWidth: 140,
            }}>
              {[
                { label: "↓ Export JSON",  action: () => { onExport(bot); setMenuId(null); } },
                { label: "⿻ Duplicate",    action: () => { onDuplicate(bot); setMenuId(null); } },
                { label: "✕ Delete",       action: () => { onDelete(bot.id); setMenuId(null); }, danger: true },
              ].map(item => (
                <button key={item.label} onClick={item.action} style={{
                  display: "block", width: "100%", padding: "9px 14px",
                  background: "none", border: "none", textAlign: "left",
                  fontSize: 12, cursor: "pointer", fontFamily: "var(--font-sans)",
                  color: item.danger ? "var(--red)" : "var(--ink-mid)",
                  transition: "background 0.1s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--bg)"}
                  onMouseLeave={e => e.currentTarget.style.background = "none"}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
      </div>
    
  );
}
