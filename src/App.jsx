import "@/styles/global.css";

import { Topbar }        from "@/components/layout/Topbar.jsx";

import { ConfigSidebar } from "@/components/panels/ConfigSidebar.jsx";
import { ChatPreview }   from "@/components/chat/ChatPreview.jsx";
import { ExportPanel }   from "@/components/export/ExportPanel.jsx";
import { Toast }         from "@/components/shared/index.jsx";

import { useBots }      from "@/hooks/useBots.js";
import { useBotConfig } from "@/hooks/useBotConfig.js";
import { useChat }      from "@/hooks/useChat.js";
import { BotConfig } from "@/models/BotConfig.js";
/**
 * Root application component.
 * Wires together hooks and layout — no business logic lives here.
 */
export default function App() {
  const {
    bots, activeBot, activeId, loading, error,
    selectBot, updateActiveBot,
    createBot, deleteBot, duplicateBot,
    exportBot, exportAll, importFromFile,
    dismissError,
  } = useBots();

  // Config setters for the active bot
  const configHandlers = useBotConfig(activeBot ?? new BotConfig(), updateActiveBot);

  // Live chat state tied to the active bot
  const chatState = useChat(activeBot);

  if (loading) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-sans)", color: "var(--ink-faint)", fontSize: 14 }}>
        <span style={{ animation: "spin 1s linear infinite", display: "inline-block", marginRight: 10, fontSize: 18 }}>⟳</span>
        Loading JavoBot…
      </div>
    );
  }

  if (!activeBot) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      {/* Top navigation bar */}
      <Topbar
        onCreateBot={createBot}
        onExportAll={exportAll}
        onImport={importFromFile}
        onReset={chatState.reset}
      />

      {/* Main content */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* Config panels */}
        <ConfigSidebar 
          config={activeBot} 
          handlers={configHandlers} 
          botListProps={{ bots, activeId, onSelect: selectBot, onDuplicate: duplicateBot, onDelete: deleteBot, onExport: exportBot }}
        />

        {/* Live preview (center) */}
        <main style={{
          flex: 1, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "28px 20px", gap: 14,
          background: `radial-gradient(ellipse at 60% 40%, var(--accent-lt) 0%, var(--bg) 65%)`,
          overflow: "auto",
        }}>
          <div style={{ fontFamily: "var(--font-head)", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-faint)", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--green)", display: "inline-block", animation: "pulse 2s infinite" }} />
            Live preview · {activeBot.botName}
          </div>

          <ChatPreview config={activeBot} chatState={chatState} />
        </main>

        {/* Export / stats panel */}
        <ExportPanel
          config={activeBot}
          msgCount={chatState.msgCount}
          onExportBot={() => exportBot(activeBot)}
        />
      </div>

      {/* Error toast */}
      <Toast message={error} onDismiss={dismissError} />
    </div>
  );
}
