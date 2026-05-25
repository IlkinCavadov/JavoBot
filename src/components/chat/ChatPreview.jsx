import { useState } from "react";
import { useTranslation } from "react-i18next";

function TypingDots() {
  const { t } = useTranslation();

  return (
    <div style={{ alignSelf: "flex-start", animation: "fadeUp 0.2s ease" }}>
      <div style={{ background: "var(--bg)", border: "1px solid var(--border)", padding: "10px 13px", borderRadius: "16px 16px 16px 3px", display: "flex", gap: 5, alignItems: "center" }}>
        {[0, 1, 2].map(i => (
          <span key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--ink-faint)", display: "block", animation: `bounce 1.1s ${i * 0.18}s infinite` }} />
        ))}
      </div>
    </div>
  );
}

export function ChatPreview({ config, chatState }) {
  const { messages, isTyping, send, bottomRef } = chatState;
  const [input, setInput] = useState("");
  const { t } = useTranslation();

  const handleSend = () => {
    if (!input.trim()) return;
    send(input);
    setInput("");
  };

  return (
    <div style={{
      width: 340, borderRadius: config.chatRadius,
      display: "flex", flexDirection: "column", overflow: "hidden",
      boxShadow: "var(--shadow-lg)",
      border: "1px solid var(--border)", background: "var(--bg-card)",
      height: 510,
    }}>
      {/* Header */}
      <div style={{ background: config.primaryColor, padding: "13px 15px", display: "flex", alignItems: "center", gap: 11, flexShrink: 0 }}>
        <div style={{ width: 35, height: 35, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>
          {config.avatar}
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", fontFamily: "var(--font-head)" }}>{config.botName}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", marginTop: 1 }}>● Online · Replies instantly</div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "13px 11px", display: "flex", flexDirection: "column", gap: 9 }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ alignSelf: msg.isBot ? "flex-start" : "flex-end", maxWidth: "80%", animation: "fadeUp 0.2s ease" }}>
            <div style={msg.isBot
              ? { background: "var(--bg)", color: "var(--ink)", padding: "9px 13px", borderRadius: "16px 16px 16px 3px", fontSize: 13, lineHeight: 1.5, border: "1px solid var(--border)" }
              : { background: config.userColor, color: "#fff", padding: "9px 13px", borderRadius: "16px 16px 3px 16px", fontSize: 13, lineHeight: 1.5 }
            }>
              {msg.text}
            </div>
            <div style={{ fontSize: 10, color: "var(--ink-faint)", marginTop: 3, textAlign: msg.isBot ? "left" : "right", padding: msg.isBot ? "0 0 0 4px" : "0 4px 0 0" }}>
              {msg.time}
            </div>
          </div>
        ))}
        {isTyping && <TypingDots />}
        <div ref={bottomRef} />
      </div>

      {/* Quick chips */}
      {config.activeChips.length > 0 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", padding: "7px 11px", borderTop: "1px solid var(--border)" }}>
          {config.activeChips.slice(0, 3).map(chip => (
            <button key={chip} onClick={() => send(chip)} style={{
              padding: "4px 10px", borderRadius: 20, border: `1px solid ${config.primaryColor}`,
              color: config.primaryColor, background: "transparent", fontSize: 11,
              cursor: "pointer", fontFamily: "var(--font-sans)", fontWeight: 500, whiteSpace: "nowrap",
            }}>
              {chip}
            </button>
          ))}
        </div>
      )}

      {/* Input row */}
      <div style={{ padding: "9px 11px", borderTop: "1px solid var(--border)", display: "flex", gap: 7, background: "var(--bg-card)", flexShrink: 0 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
          placeholder={t("inputPlaceholder")}
          style={{ flex: 1, padding: "8px 13px", borderRadius: 22, border: "1px solid var(--border-mid)", fontSize: 13, fontFamily: "var(--font-sans)", background: "var(--bg)", color: "var(--ink)", outline: "none" }}
        />
        <button onClick={handleSend} style={{ width: 34, height: 34, borderRadius: "50%", background: config.primaryColor, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#fff", fontSize: 14 }}>
          ➤
        </button>
      </div>
    </div>
  );
}
