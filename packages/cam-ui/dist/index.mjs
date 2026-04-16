// src/HoverBtn.tsx
import { useState } from "react";
import { jsx } from "react/jsx-runtime";
function HoverBtn({
  style,
  children,
  onClick,
  title,
  disabled,
  accentColor = "rgba(0,0,0,0.06)",
  restBorder
}) {
  const [hov, setHov] = useState(false);
  return /* @__PURE__ */ jsx(
    "button",
    {
      title,
      onClick,
      disabled,
      onMouseEnter: () => setHov(true),
      onMouseLeave: () => setHov(false),
      style: {
        ...style,
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
        fontWeight: 400,
        borderRadius: "6px",
        opacity: disabled ? 0.55 : 1,
        background: hov ? accentColor : style?.background ?? "transparent",
        ...restBorder && !disabled ? { border: restBorder } : {}
      },
      children
    }
  );
}

// src/TabBtn.tsx
import { useState as useState2 } from "react";
import { jsx as jsx2 } from "react/jsx-runtime";
function TabBtn({
  active = false,
  children,
  onClick,
  activeColor = "rgba(255,255,255,0.3)",
  activeBg = "rgba(255,255,255,0.1)",
  mutedColor = "rgba(255,255,255,0.5)",
  bg = "transparent",
  borderColor = "rgba(255,255,255,0.12)",
  style
}) {
  const [hov, setHov] = useState2(false);
  return /* @__PURE__ */ jsx2(
    "button",
    {
      onClick,
      onMouseEnter: () => setHov(true),
      onMouseLeave: () => setHov(false),
      style: {
        display: "flex",
        alignItems: "center",
        gap: 5,
        padding: "4px 12px",
        borderRadius: 20,
        border: `1px solid ${active ? activeColor : borderColor}`,
        background: active ? activeBg : hov ? activeBg : bg,
        color: active ? "inherit" : mutedColor,
        cursor: "pointer",
        fontSize: 12,
        fontWeight: 300,
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
        transition: "background 0.15s ease, border-color 0.15s ease",
        ...style
      },
      children
    }
  );
}
export {
  HoverBtn,
  TabBtn
};
//# sourceMappingURL=index.mjs.map