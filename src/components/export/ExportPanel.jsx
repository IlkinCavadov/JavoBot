import { embedCodeGenerator } from "../../services/EmbedCodeGenerator.js";
import { useClipboard }       from "../../hooks/useClipboard.js";
import { PrimaryButton, OutlineButton, SectionLabel } from "../shared/index.jsx";
import { useTranslation } from "react-i18next";


export function ExportPanel({ config, msgCount, onExportBot }) {
  const { copied, copy } = useClipboard();
  const snippet = embedCodeGenerator.generateSnippet(config);
  const { t } = useTranslation();

  function downloadHTML() {
    const html  = embedCodeGenerator.generateStandaloneHTML(config);
    const blob  = new Blob([html], { type: "text/html" });
    const url   = URL.createObjectURL(blob);
    const a     = Object.assign(document.createElement("a"), {
      href:     url,
      download: `${config.botName.toLowerCase().replace(/\s+/g, "-")}-chatbot.html`,
    });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <aside style={{
      width: 290, background: "var(--bg-card)", borderLeft: "1px solid var(--border)",
      display: "flex", flexDirection: "column", overflowY: "auto",
      maxHeight: "calc(100vh - 52px)", padding: "18px 16px", gap: 20, flexShrink: 0,
    }}>
      {/* Stats */}
      <div>
        <SectionLabel>{t("sessionStats")}</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
          {[
            [t("messages"),    msgCount],
            [t("qaEntries"), config.qaItems.length],
            [t("chips"),       config.activeChips.length],
            [t("engine"),      "AI ✦"],
          ].map(([label, value]) => (
            <div key={label} style={{ background: "var(--bg)", borderRadius: "var(--radius-md)", padding: "11px 13px", border: "1px solid var(--border)" }}>
              <div style={{ fontFamily: "var(--font-head)", fontSize: 21, fontWeight: 700, color: label === "Engine" ? "var(--green)" : "var(--ink)", lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: 11, color: "var(--ink-faint)", marginTop: 4, fontWeight: 500 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>


      {/* Actions */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <SectionLabel>{t("export")}</SectionLabel>
        <PrimaryButton onClick={onExportBot}>
          {t("exportConfig")}
        </PrimaryButton>
        <OutlineButton onClick={downloadHTML}>
          {t("exportHTML")}
        </OutlineButton>
      </div>

      {/* Tip card */}

    </aside>
  );
}