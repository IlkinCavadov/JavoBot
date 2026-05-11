import { useState } from "react";

export function BotList({ bots, activeId, onSelect, onDuplicate, onDelete, onExport }) {
  const [menuId, setMenuId] = useState(null);

  return (
    <aside style={{
      width: 200, background: "var(--bg-card)", borderRight: "1px solid var(--border)",
      display: "flex", flexDirection: "column", overflowY: "auto",
      maxHeight: "calc(100vh - 52px)", flexShrink: 0,
    }}>
      <div style={{ padding: "12px 12px 6px", fontFamily: "var(--font-head)", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-faint)" }}>
        My bots ({bots.length})
      </div>

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
    </aside>
  );
}
