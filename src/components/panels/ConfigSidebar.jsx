import { useState } from "react";
import { TABS } from "../../constants/index.js";
import { IdentityPanel, BehaviorPanel, KnowledgePanel, StylePanel, BotList } from "./index.jsx";

const PANELS = {
  identity:  IdentityPanel,
  behavior:  BehaviorPanel,
  knowledge: KnowledgePanel,
  style:     StylePanel,
  mybots: BotList
};

export function ConfigSidebar({ config, handlers, botListProps }) {
  const [activeTab, setActiveTab] = useState("identity");
  const Panel = PANELS[activeTab];

  return (
    <div style={{
      width: 400, background: "var(--bg-card)", borderRight: "1px solid var(--border)",
      display: "flex", flexDirection: "column", overflowY: "auto",
      maxHeight: "calc(100vh - 52px)", flexShrink: 0,
    }}>
      {/* Tab bar */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--border)", position: "sticky", top: 0, background: "var(--bg-card)", zIndex: 10 }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
            flex: 1, padding: "11px 0", fontSize: 11, fontWeight: 600,
            fontFamily: "var(--font-head)", letterSpacing: "0.04em", textTransform: "uppercase",
            border: "none", borderBottom: `2px solid ${activeTab === t.key ? "var(--accent)" : "transparent"}`,
            background: "transparent",
            color: activeTab === t.key ? "var(--accent)" : "var(--ink-faint)",
            cursor: "pointer", transition: "all 0.15s",
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Panel body */}
      <div style={{ padding: activeTab === "mybots" ? 0 : "18px 16px" }}>
        {activeTab === "mybots"
          ? <BotList {...botListProps} />
          : <Panel config={config} h={handlers} />
        }
      </div>
    </div>
  );
}
