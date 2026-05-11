import { useState } from "react";

// ── Base input styles ─────────────────────────────────────────
export const inputCss = {
  width: "100%", padding: "8px 11px", borderRadius: "var(--radius-sm)",
  border: "1px solid var(--border)", background: "var(--bg)",
  fontSize: 13, color: "var(--ink)", fontFamily: "var(--font-sans)",
  boxSizing: "border-box", transition: "border-color 0.15s",
};

export const textareaCss = {
  ...inputCss, resize: "vertical", minHeight: 72, lineHeight: 1.5,
};

export const selectCss = { ...inputCss, cursor: "pointer" };

// ── SectionLabel ──────────────────────────────────────────────
export function SectionLabel({ children, style }) {
  return (
    <div style={{
      fontFamily: "var(--font-head)", fontSize: 10, fontWeight: 700,
      letterSpacing: "0.1em", textTransform: "uppercase",
      color: "var(--ink-faint)", marginBottom: 8, ...style,
    }}>
      {children}
    </div>
  );
}

// ── Field ─────────────────────────────────────────────────────
export function Field({ label, children, style }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5, ...style }}>
      <label style={{ fontSize: 12, fontWeight: 500, color: "var(--ink-mid)" }}>{label}</label>
      {children}
    </div>
  );
}

// ── Toggle ────────────────────────────────────────────────────
export function Toggle({ checked, onChange }) {
  return (
    <label style={{ position: "relative", width: 36, height: 20, display: "inline-block", cursor: "pointer", flexShrink: 0 }}>
      <input type="checkbox" checked={checked} onChange={onChange} style={{ opacity: 0, width: 0, height: 0 }} />
      <span style={{ position: "absolute", inset: 0, background: checked ? "var(--accent)" : "rgba(0,0,0,0.15)", borderRadius: 20, transition: "0.2s" }} />
      <span style={{ position: "absolute", width: 14, height: 14, background: "#fff", borderRadius: "50%", top: 3, left: checked ? 19 : 3, transition: "0.2s" }} />
    </label>
  );
}

// ── ToggleRow ─────────────────────────────────────────────────
export function ToggleRow({ label, checked, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ fontSize: 13, color: "var(--ink-mid)" }}>{label}</span>
      <Toggle checked={checked} onChange={e => onChange(e.target.checked)} />
    </div>
  );
}

// ── ColorPicker ───────────────────────────────────────────────
export function ColorPicker({ value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <input type="color" value={value} onChange={e => onChange(e.target.value)}
        style={{ width: 38, height: 38, borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", cursor: "pointer", padding: 2, background: "var(--bg)" }} />
      <input type="text" value={value} maxLength={7}
        onChange={e => /^#[0-9a-fA-F]{0,6}$/.test(e.target.value) && onChange(e.target.value)}
        style={{ ...inputCss, width: 90, fontFamily: "var(--font-mono)", fontSize: 12 }} />
    </div>
  );
}

// ── ToneButton ────────────────────────────────────────────────
export function ToneButton({ value, label, emoji, selected, onSelect }) {
  return (
    <button onClick={() => onSelect(value)} style={{
      padding: "8px 10px", borderRadius: "var(--radius-sm)",
      border: `1.5px solid ${selected ? "var(--accent)" : "var(--border)"}`,
      background: selected ? "var(--accent-lt)" : "var(--bg)",
      color: selected ? "var(--accent)" : "var(--ink-mid)",
      fontSize: 12, fontWeight: selected ? 600 : 400,
      cursor: "pointer", fontFamily: "var(--font-sans)", transition: "all 0.15s",
    }}>
      {emoji} {label}
    </button>
  );
}

// ── PrimaryButton ─────────────────────────────────────────────
export function PrimaryButton({ onClick, children, disabled, style }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        width: "100%", padding: "10px", borderRadius: "var(--radius-md)",
        background: disabled ? "var(--ink-faint)" : hover ? "var(--accent-dk)" : "var(--accent)",
        color: "#fff", border: "none", fontSize: 13, fontWeight: 600,
        fontFamily: "var(--font-head)", cursor: disabled ? "not-allowed" : "pointer",
        letterSpacing: "0.03em", transition: "background 0.15s", ...style,
      }}>
      {children}
    </button>
  );
}

// ── OutlineButton ─────────────────────────────────────────────
export function OutlineButton({ onClick, children, style }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        width: "100%", padding: "10px", borderRadius: "var(--radius-md)",
        background: hover ? "var(--accent-lt)" : "var(--bg)",
        color: "var(--accent)", border: "1.5px solid var(--accent)",
        fontSize: 13, fontWeight: 600, fontFamily: "var(--font-head)",
        cursor: "pointer", transition: "background 0.15s", ...style,
      }}>
      {children}
    </button>
  );
}

// ── GhostButton ───────────────────────────────────────────────
export function GhostButton({ onClick, children, style }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        padding: "5px 12px", borderRadius: "var(--radius-sm)",
        background: hover ? "var(--border)" : "transparent",
        color: "var(--ink-mid)", border: "1px solid var(--border)",
        fontSize: 12, cursor: "pointer", fontFamily: "var(--font-sans)",
        transition: "background 0.15s", ...style,
      }}>
      {children}
    </button>
  );
}

// ── Toast ─────────────────────────────────────────────────────
export function Toast({ message, type = "error", onDismiss }) {
  if (!message) return null;
  const colors = { error: "#E24B4A", success: "#1DB87A", info: "var(--accent)" };
  return (
    <div style={{
      position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)",
      background: "#1e1e2e", color: "#fff", padding: "10px 18px",
      borderRadius: "var(--radius-md)", fontSize: 13,
      borderLeft: `4px solid ${colors[type] ?? colors.error}`,
      display: "flex", alignItems: "center", gap: 12,
      boxShadow: "var(--shadow-lg)", zIndex: 1000,
    }}>
      <span>{message}</span>
      <button onClick={onDismiss} style={{ background: "none", border: "none", color: "#aaa", cursor: "pointer", fontSize: 16 }}>✕</button>
    </div>
  );
}
