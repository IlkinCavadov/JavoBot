import { embedCodeGenerator } from "../../services/EmbedCodeGenerator.js";
import { useClipboard }       from "../../hooks/useClipboard.js";
import { PrimaryButton, OutlineButton, SectionLabel } from "../shared/index.jsx";

export function ExportPanel({ config, msgCount, onExportBot }) {
  const { copied, copy } = useClipboard();
  const snippet = embedCodeGenerator.generateSnippet(config);

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
        <SectionLabel>Session stats</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
          {[
            ["Messages",    msgCount],
            ["Q&A entries", config.qaItems.length],
            ["Chips",       config.activeChips.length],
            ["Engine",      "AI ✦"],
          ].map(([label, value]) => (
            <div key={label} style={{ background: "var(--bg)", borderRadius: "var(--radius-md)", padding: "11px 13px", border: "1px solid var(--border)" }}>
              <div style={{ fontFamily: "var(--font-head)", fontSize: 21, fontWeight: 700, color: label === "Engine" ? "var(--green)" : "var(--ink)", lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: 11, color: "var(--ink-faint)", marginTop: 4, fontWeight: 500 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Embed snippet */}
      <div>
        <SectionLabel>Embed snippet</SectionLabel>
        <div style={{ background: "#13131A", borderRadius: "var(--radius-md)", overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ padding: "9px 13px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 6 }}>
            {["#FF5F57", "#FFBD2E", "#28C840"].map(c => (
              <span key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, display: "inline-block" }} />
            ))}
            <button onClick={() => copy(snippet)} style={{
              padding: "3px 10px", borderRadius: 5, background: "rgba(255,255,255,0.07)",
              color: "#A8B4CC", border: "none", fontSize: 11, cursor: "pointer",
              fontFamily: "var(--font-sans)", marginLeft: "auto",
            }}>
              {copied ? "✓ Copied!" : "Copy"}
            </button>
          </div>
          <pre style={{ padding: 13, fontFamily: "var(--font-mono)", fontSize: 11, lineHeight: 1.7, color: "#A8B4CC", overflowX: "auto", maxHeight: 200, overflowY: "auto", margin: 0 }}>
            {snippet}
          </pre>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <SectionLabel>Export</SectionLabel>
        <PrimaryButton onClick={onExportBot}>↓ Download config JSON</PrimaryButton>
        <OutlineButton onClick={downloadHTML}>
          ⬡ Download HTML file
        </OutlineButton>
      </div>

      {/* Tip card */}

    </aside>
  );
}