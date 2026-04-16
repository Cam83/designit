"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  HoverBtn: () => HoverBtn,
  TabBtn: () => TabBtn
});
module.exports = __toCommonJS(index_exports);

// src/HoverBtn.tsx
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
function HoverBtn({
  style,
  children,
  onClick,
  title,
  disabled,
  accentColor = "rgba(0,0,0,0.06)",
  restBorder
}) {
  const [hov, setHov] = (0, import_react.useState)(false);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
var import_react2 = require("react");
var import_jsx_runtime2 = require("react/jsx-runtime");
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
  const [hov, setHov] = (0, import_react2.useState)(false);
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  HoverBtn,
  TabBtn
});
//# sourceMappingURL=index.js.map