import { useRef } from "react";
import { GhostButton } from "../shared/index.jsx";
import { APP_NAME }    from "../../constants/index.js";
import { useTranslation } from "react-i18next";

export function Topbar({ onCreateBot, onExportAll, onImport, onReset }) {
  const fileRef = useRef(null);
  const { t } = useTranslation();

  return (
    <header style={{
      background: "var(--bg-card)", borderBottom: "1px solid var(--border)",
      padding: "0 20px", height: 52,
      display: "flex", alignItems: "center", gap: 14,
      position: "sticky", top: 0, zIndex: 200,
    }}>
      {/* Logo */}
      <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 17, color: "var(--ink)", display: "flex", alignItems: "center", gap: 7 }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)", display: "inline-block" }} />
        {APP_NAME}
      </div>

      <div style={{ width: 1, height: 20, background: "var(--border)" }} />
      <span style={{ fontSize: 12, color: "var(--ink-faint)", fontWeight: 400 }}>AI Chatbot Builder</span>


      <div style={{ flex: 1 }} />

      {/* Actions */}
      <GhostButton onClick={onReset} style={{ padding: "5px 10px" }}>↺ {t("resetBot")}</GhostButton>

      <GhostButton onClick={() => fileRef.current?.click()} style={{ padding: "5px 10px" }}>
        ↑ Import
      </GhostButton>
      <input ref={fileRef} type="file" accept=".json" style={{ display: "none" }}
        onChange={e => { const f = e.target.files[0]; if (f) { onImport(f); e.target.value = ""; } }} />

      <GhostButton onClick={onExportAll} style={{ padding: "5px 10px" }}>↓ Export all</GhostButton>

      <button onClick={onCreateBot} style={{
        padding: "6px 14px", borderRadius: "var(--radius-sm)",
        background: "var(--accent)", color: "#fff", border: "none",
        fontSize: 12, fontWeight: 600, cursor: "pointer",
        fontFamily: "var(--font-head)", letterSpacing: "0.03em",
      }}>
        + {t("newBot")}
      </button>
    </header>
  );
}
