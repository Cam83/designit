"use client"

import { useState, useRef, useEffect } from "react"
import {
  ChevronDown, LayoutGrid, Gauge, BarChart3, Clock, Users, Database,
  FolderOpen, Building2, ChefHat, HelpCircle, Bell, Settings, Layers,
  Plus, RefreshCw, Settings2, Check, X, Circle, UserPlus, ArrowRightLeft,
  CalendarClock, Briefcase, DollarSign, ChevronLeft, ListFilter, Sun, Moon, MoreVertical
} from "lucide-react"

const getGlobalStyles = (theme) => `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${theme.bg}; color: ${theme.fg}; font-family: Inter, sans-serif; }
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${theme.scrollAlpha40}; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: ${theme.scrollAlpha70}; }
  input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
`

const darkTheme = {
  bg: "#000000", fg: "#ededed", card: "#000000", popover: "#111111",
  primary: "#ededed", primaryFg: "#000000", secondary: "#1a1a1a",
  secondaryFg: "#a1a1a1", muted: "#1a1a1a", mutedFg: "#888888",
  accent: "#1a1a1a", accentFg: "#ededed", border: "#1f1f1f",
  sidebar: "#000000", sidebarFg: "#a1a1a1", sidebarBorder: "#1f1f1f",
  fgAlpha30: "rgba(237,237,237,0.3)", fgAlpha10: "rgba(237,237,237,0.1)", 
  fgAlpha06: "rgba(237,237,237,0.06)", fgAlpha03: "rgba(237,237,237,0.03)", 
  fgAlpha20: "rgba(237,237,237,0.2)", fgAlpha70: "rgba(237,237,237,0.7)",
  borderAlpha25: "rgba(168,168,168,0.25)", scrollAlpha40: "rgba(139,139,139,0.4)",
  scrollAlpha70: "rgba(139,139,139,0.7)", overlayBg: "rgba(0,0,0,0.7)", shadowDark: "rgba(0,0,0,0.5)", shadowDarker: "rgba(0,0,0,0.6)"
}

const lightTheme = {
  bg: "#ffffff", fg: "#1a1a1a", card: "#ffffff", popover: "#f5f5f5",
  primary: "#1a1a1a", primaryFg: "#ffffff", secondary: "#f0f0f0",
  secondaryFg: "#333333", muted: "#f0f0f0", mutedFg: "#555555",
  accent: "#f0f0f0", accentFg: "#1a1a1a", border: "#e0e0e0",
  sidebar: "#ffffff", sidebarFg: "#333333", sidebarBorder: "#f0f0f0",
  fgAlpha30: "rgba(26,26,26,0.3)", fgAlpha10: "rgba(26,26,26,0.1)", 
  fgAlpha06: "rgba(26,26,26,0.06)", fgAlpha03: "rgba(26,26,26,0.03)", 
  fgAlpha20: "rgba(26,26,26,0.2)", fgAlpha70: "rgba(26,26,26,0.7)",
  borderAlpha25: "rgba(26,26,26,0.15)", scrollAlpha40: "rgba(180,180,180,0.4)",
  scrollAlpha70: "rgba(180,180,180,0.7)", overlayBg: "rgba(0,0,0,0.5)", shadowDark: "rgba(0,0,0,0.3)", shadowDarker: "rgba(0,0,0,0.4)"
}

let t = darkTheme

const getStyles = (theme) => ({
  sidebar: { width: 260, borderRight: `1px solid ${theme.sidebarBorder}`, display: "flex", flexDirection: "column", height: "100vh", flexShrink: 0 },
  main: { flex: 1, display: "flex", flexDirection: "column", background: theme.bg, overflow: "hidden", minWidth: 0 },
  iconBtn: { display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: 6, border: "none", background: "transparent", color: theme.secondaryFg, cursor: "pointer" },
  primaryBtn: { display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: 6, border: "none", background: theme.fg, color: theme.bg, cursor: "pointer" },
  pillBtn: (active) => ({ display: "flex", alignItems: "center", gap: 5, padding: "4px 12px", borderRadius: 20, border: `1px solid ${active ? theme.fgAlpha30 : theme.border}`, background: active ? theme.fgAlpha10 : theme.bg, color: active ? theme.fg : theme.secondaryFg, cursor: "pointer", fontSize: 12, fontWeight: active ? 500 : 400 }),
  outlineBtn: { display: "flex", alignItems: "center", gap: 5, padding: "4px 12px", borderRadius: 6, border: `1px solid ${theme.border}`, background: "transparent", color: theme.secondaryFg, cursor: "pointer", fontSize: 12 },
  dropdown: { position: "absolute", top: "100%", left: 0, marginTop: 4, background: theme.popover, border: `1px solid ${theme.border}`, borderRadius: 8, padding: 4, boxShadow: `0 4px 16px ${theme.shadowDark}`, zIndex: 50, minWidth: 180 },
  dropdownItem: (active) => ({ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "6px 10px", borderRadius: 5, border: "none", background: "transparent", color: active ? theme.fg : theme.secondaryFg, cursor: "pointer", fontSize: 12, fontWeight: active ? 500 : 400, textAlign: "left" }),
})

let s = getStyles(t)

function HoverRow({ selected, children, onClick, style }) {
  const [hov, setHov] = useState(false)
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ ...style, background: selected ? t.fgAlpha06 : hov ? t.fgAlpha03 : "transparent" }}>
      {children}
    </div>
  )
}

function HoverBtn({ style, children, onClick, title, disabled }) {
  const [hov, setHov] = useState(false)
  return (
    <button title={title} onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ ...style, background: hov ? t.accent : style?.background || "transparent" }}>
      {children}
    </button>
  )
}

function DropdownWrapper({ trigger, children, open, setOpen }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return
    function h(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener("mousedown", h)
    return () => document.removeEventListener("mousedown", h)
  }, [open, setOpen])
  return <div ref={ref} style={{ position: "relative" }}>{trigger}{open && children}</div>
}

function InlineEdit({ value, onChange, style }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const ref = useRef(null)
  useEffect(() => { if (editing && ref.current) { ref.current.focus(); ref.current.select() } }, [editing])
  useEffect(() => { setDraft(value) }, [value])
  function commit() {
    const v = draft.trim()
    if (v && v !== value) onChange(v)
    else setDraft(value)
    setEditing(false)
  }
  if (editing) return (
    <input ref={ref} value={draft} onChange={e => setDraft(e.target.value)} onBlur={commit}
      onKeyDown={e => { if (e.key === "Enter") commit(); if (e.key === "Escape") { setDraft(value); setEditing(false) } }}
      style={{ fontSize: 13, fontWeight: 500, color: t.fg, background: t.accent, border: `1px solid ${t.fgAlpha20}`, borderRadius: 4, padding: "2px 8px", outline: "none", fontFamily: "inherit", ...style }} />
  )
  return (
    <button onClick={() => { setDraft(value); setEditing(true) }}
      style={{ fontSize: 13, fontWeight: 500, color: t.fg, background: t.accent, borderRadius: 4, padding: "2px 8px", border: "none", cursor: "text", fontFamily: "inherit", ...style }}>
      {value}
    </button>
  )
}

function InlineEditRate({ value, onChange }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(String(value))
  const ref = useRef(null)
  useEffect(() => { if (editing && ref.current) { ref.current.focus(); ref.current.select() } }, [editing])
  function commit() {
    const n = parseFloat(draft)
    if (!isNaN(n) && n >= 0 && n !== value) onChange(n)
    else setDraft(String(value))
    setEditing(false)
  }
  if (editing) return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <span style={{ fontSize: 13, color: t.mutedFg }}>$</span>
      <input ref={ref} value={draft} onChange={e => setDraft(e.target.value)} onBlur={commit}
        onKeyDown={e => { if (e.key === "Enter") commit(); if (e.key === "Escape") { setDraft(String(value)); setEditing(false) } }}
        style={{ width: 60, fontSize: 13, color: t.fg, background: t.bg, border: `1px solid ${t.fgAlpha20}`, borderRadius: 4, padding: "2px 6px", outline: "none", fontFamily: "inherit" }} />
    </div>
  )
  return (
    <button onClick={() => { setDraft(String(value)); setEditing(true) }}
      style={{ fontSize: 13, color: t.fg, background: "transparent", border: "none", cursor: "text", padding: "2px 4px", borderRadius: 4, fontFamily: "inherit" }}>
      ${value}
    </button>
  )
}

function Collapsible({ expanded, children }) {
  const [h, setH] = useState(expanded ? "auto" : "0px")
  const ref = useRef(null)
  useEffect(() => {
    if (!ref.current) return
    if (expanded) {
      setH(ref.current.scrollHeight + "px")
      const timer = setTimeout(() => setH("auto"), 210)
      return () => clearTimeout(timer)
    } else {
      setH(ref.current.scrollHeight + "px")
      requestAnimationFrame(() => setH("0px"))
    }
  }, [expanded])
  return (
    <div style={{ overflow: "hidden", height: h, transition: "height 0.2s ease" }}>
      <div ref={ref} style={{ opacity: expanded ? 1 : 0, transition: "opacity 0.15s" }}>{children}</div>
    </div>
  )
}

function NikeLogo({ isDarkMode }) {
  return (
    <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/002_nike-logos-swoosh-white-0nPbb6zNJMvApD16nQ1CvQL4h5mmIp.png" alt="Nike" style={{ height: 24, width: "auto", filter: isDarkMode ? "none" : "brightness(0)" }} />
  )
}

function ScheduleIcon() {
  return <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><rect x="3.958" y="8.958" width="12.083" height="2.083" rx="0.833" stroke="currentColor" strokeWidth="1"/><rect x="3.958" y="13.958" width="4.583" height="2.083" rx="0.833" stroke="currentColor" strokeWidth="1"/><rect x="9.792" y="3.958" width="6.25" height="2.083" rx="0.833" stroke="currentColor" strokeWidth="1"/></svg>
}
function ProjectPlanIcon() {
  return <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M4.037 15.832H15.963" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/><rect x="8.43" y="9.869" width="7.402" height="2.879" rx="0.822" stroke="currentColor" strokeWidth="1"/><rect x="3.907" y="3.907" width="7.402" height="2.879" rx="0.822" stroke="currentColor" strokeWidth="1"/></svg>
}
function LogTeamIcon() {
  return <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M16.042 9.375V6.458C16.042 5.078 14.922 3.958 13.542 3.958H6.458C5.078 3.958 3.958 5.078 3.958 6.458V13.542C3.958 14.922 5.078 16.042 6.458 16.042H7.708" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/><path d="M11.563 16.042L9.792 8.958L16.042 12.523L12.917 13.357L11.563 16.042Z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg>
}

// ── Data ──
const INITIAL_ROLES = [
  { name: "Designer", costRate: 120, activePeople: 3, unassigned: 1 },
  { name: "Senior Designer", costRate: 160, activePeople: 5, unassigned: 0 },
  { name: "Developer", costRate: 140, activePeople: 8, unassigned: 2 },
  { name: "Project Manager", costRate: 130, activePeople: 4, unassigned: 0 },
  { name: "Art Director", costRate: 155, activePeople: 3, unassigned: 1 },
  { name: "Copywriter", costRate: 110, activePeople: 4, unassigned: 0 },
  { name: "Account Executive", costRate: 125, activePeople: 6, unassigned: 1 },
  { name: "Creative Director", costRate: 180, activePeople: 2, unassigned: 0 },
  { name: "UX/UI Designer", costRate: 135, activePeople: 5, unassigned: 2 },
  { name: "Motion Designer", costRate: 145, activePeople: 2, unassigned: 0 },
  { name: "Brand Strategist", costRate: 150, activePeople: 3, unassigned: 1 },
  { name: "Social Media Manager", costRate: 105, activePeople: 4, unassigned: 0 },
]
const INITIAL_DEPARTMENTS = [{ name: "Design" }, { name: "Engineering" }, { name: "Operations" }, { name: "Marketing" }]
const INITIAL_PEOPLE = [
  { name: "Jake Peralta", roleId: 0, departmentId: 0, office: "New York" },
  { name: "Amy Santiago", roleId: 1, departmentId: 0, office: "New York" },
  { name: "Rosa Diaz", roleId: 2, departmentId: 1, office: "Melbourne" },
  { name: "Terry Jeffords", roleId: 3, departmentId: 2, office: "Sydney" },
  { name: "Charles Boyle", roleId: 1, departmentId: 0, office: "New York" },
  { name: "Michael Hitchcock", roleId: 0, departmentId: 1, office: "London" },
  { name: "Norm Scully", roleId: 2, departmentId: 2, office: "New York" },
  { name: "Rachel Green", roleId: 0, departmentId: 0, office: "Sydney" },
  { name: "Monica Geller", roleId: 1, departmentId: 1, office: "London" },
  { name: "Phoebe Buffay", roleId: 2, departmentId: 2, office: "New York" },
  { name: "Joey Tribbiani", roleId: 3, departmentId: 0, office: "Melbourne" },
  { name: "Chandler Bing", roleId: 0, departmentId: 1, office: "Sydney" },
  { name: "Ross Geller", roleId: 1, departmentId: 2, office: "London" },
  { name: "Gunther", roleId: 2, departmentId: 1, office: "New York" },
  { name: "Janice Litman", roleId: 3, departmentId: 2, office: "Melbourne" },
]
const INITIAL_CONTRACTORS = [
  { name: "Raymond Holt", roleId: 3, departmentId: 2, office: "London" },
  { name: "Madeline Wuntch", roleId: 2, departmentId: 1, office: "Sydney" },
  { name: "Kevin Cozner", roleId: 0, departmentId: 0, office: "Melbourne" },
  { name: "Adrian Pimento", roleId: 2, departmentId: 0, office: "New York" },
  { name: "Gina Linetti", roleId: 3, departmentId: 1, office: "Melbourne" },
  { name: "Nikolaj Boyle", roleId: 0, departmentId: 0, office: "Sydney" },
  { name: "Mike Hannigan", roleId: 2, departmentId: 1, office: "New York" },
  { name: "Darth Vader", roleId: 0, departmentId: 1, office: "London" },
  { name: "Luke Skywalker", roleId: 1, departmentId: 2, office: "Sydney" },
  { name: "Han Solo", roleId: 3, departmentId: 1, office: "Melbourne" },
]
const INITIAL_PROJECTS = [
  { name: "Website Redesign", code: "WEB-001", clientId: 0, stage: "active", margin: 25, budget: 50000, startDate: "2026-01-15", endDate: "2026-04-30", ownerId: 0, office: "Sydney" },
  { name: "Mobile App", code: "APP-001", clientId: 1, stage: "planning", margin: 30, budget: 75000, startDate: "2026-02-01", endDate: "2026-08-31", ownerId: 1, office: "Melbourne" },
  { name: "Brand Identity", code: "BRD-001", clientId: 0, stage: "completed", margin: 35, budget: 25000, startDate: "2025-10-01", endDate: "2025-12-15", ownerId: 2, office: "New York" },
  { name: "Dashboard Dev", code: "DASH-001", clientId: 2, stage: "active", margin: 28, budget: 60000, startDate: "2026-01-20", endDate: "2026-06-30", ownerId: 3, office: "London" },
]
const INITIAL_CLIENTS_DATA = [{ name: "Nike" }, { name: "Reebok" }, { name: "Adidas" }]
const ALL_OFFICES = ["Global", "New York", "London", "Sydney", "Americas", "Europe", "Asia"]
const STAGE_COLORS = { planning: "#f59e0b", active: "#10b981", completed: "#6b7280", "on-hold": "#ef4444" }
const CURRENCIES = ["USD","AUD","GBP","EUR","CAD","NZD","SGD","JPY"]

const ACTIVITY_LOG_DATA = [
  { source: "people", entity: "Jake Peralta", type: "allocation", description: "Allocated to Project Phoenix", date: "Feb 12, 2026", details: "40 hrs/week for 8 weeks" },
  { source: "people", entity: "Rosa Diaz", type: "allocation", description: "Allocated to Project Stealth", date: "Feb 14, 2026", details: "40 hrs/week for 10 weeks" },
  { source: "roles", entity: "Designer", type: "person_assigned", description: "Jake Peralta assigned", date: "Feb 12, 2026", details: "Transferred from Developer role" },
  { source: "people", entity: "Amy Santiago", type: "allocation", description: "Allocated to Project Binder", date: "Feb 5, 2026", details: "35 hrs/week for 6 weeks" },
  { source: "roles", entity: "Developer", type: "rate_change", description: "Cost rate changed from $130 to $140", date: "Jan 15, 2026", details: "Market rate adjustment" },
  { source: "departments", entity: "Design", type: "person_assigned", description: "Amy Santiago added", date: "Jan 10, 2026", details: "Transferred from Engineering" },
  { source: "roles", entity: "Senior Designer", type: "person_assigned", description: "Amy Santiago assigned", date: "Jan 10, 2026", details: "Promoted from Designer" },
  { source: "people", entity: "Jake Peralta", type: "role_change", description: "Role changed from Developer to Designer", date: "Jan 28, 2026", details: "Updated by Amy Santiago" },
  { source: "departments", entity: "Marketing", type: "renamed", description: "Renamed from Growth to Marketing", date: "Jan 15, 2026" },
  { source: "roles", entity: "Designer", type: "rate_change", description: "Cost rate changed from $100 to $120", date: "Jan 20, 2026", details: "Annual rate review" },
]
const ROLE_ACTIVITY = {
  "Designer": [
    { type: "person_assigned", description: "Jake Peralta assigned", date: "Feb 12, 2026", details: "Transferred from Developer role" },
    { type: "rate_change", description: "Cost rate changed from $100 to $120", date: "Jan 20, 2026", details: "Annual rate review" },
    { type: "created", description: "Role created", date: "Sep 1, 2025", details: "Initial cost rate: $100" },
  ],
  "Developer": [
    { type: "rate_change", description: "Cost rate changed from $130 to $140", date: "Jan 15, 2026", details: "Market rate adjustment" },
    { type: "created", description: "Role created", date: "Jun 1, 2025", details: "Initial cost rate: $130" },
  ],
}
const PERSON_ACTIVITY = {
  "Jake Peralta": [
    { type: "allocation", description: "Allocated to Project Phoenix", date: "Feb 12, 2026", details: "40 hrs/week for 8 weeks" },
    { type: "role_change", description: "Role changed from Developer to Designer", date: "Jan 28, 2026" },
    { type: "added", description: "Added to the team", date: "Sep 15, 2025", details: "Joined as Developer" },
  ],
  "Amy Santiago": [
    { type: "allocation", description: "Allocated to Project Binder", date: "Feb 5, 2026", details: "35 hrs/week for 6 weeks" },
    { type: "role_change", description: "Role changed from Designer to Senior Designer", date: "Jan 10, 2026" },
    { type: "added", description: "Added to the team", date: "Aug 1, 2025" },
  ],
}

const CLIENTS_FULL = [
  { name: "Nike", projects: 5, rateCards: [
    { title: "Standard Rate Card", currency: "USD", offices: "all", notes: "Initial Standard rates", effectiveFrom: "", linkedRoles: [{roleId:0,billRate:150},{roleId:1,billRate:195},{roleId:2,billRate:180},{roleId:3,billRate:200},{roleId:4,billRate:185},{roleId:5,billRate:165}] },
    { title: "Premium Rate Card", currency: "USD", offices: ["Sydney"], notes: "", effectiveFrom: "", linkedRoles: [{roleId:0,billRate:170},{roleId:1,billRate:220},{roleId:2,billRate:205},{roleId:3,billRate:225},{roleId:4,billRate:210},{roleId:5,billRate:190}] },
    { title: "Discount rate", currency: "USD", offices: "all", notes: "", effectiveFrom: "", linkedRoles: [{roleId:0,billRate:130},{roleId:1,billRate:180},{roleId:2,billRate:160},{roleId:3,billRate:185},{roleId:4,billRate:170},{roleId:5,billRate:150}] },
  ]},
  { name: "Google", projects: 12, rateCards: [
    { title: "Google Standard", currency: "USD", offices: "all", notes: "Initial Standard rates", effectiveFrom: "", linkedRoles: [{roleId:0,billRate:160},{roleId:1,billRate:210},{roleId:2,billRate:185},{roleId:3,billRate:220},{roleId:4,billRate:205},{roleId:5,billRate:190}] },
    { title: "Discount rate", currency: "USD", offices: "all", notes: "", effectiveFrom: "", linkedRoles: [{roleId:0,billRate:135},{roleId:1,billRate:185},{roleId:2,billRate:165},{roleId:3,billRate:190},{roleId:4,billRate:175},{roleId:5,billRate:155}] },
  ]},
  { name: "Verizon", projects: 6, rateCards: [
    { title: "Standard Rate Card", currency: "USD", offices: "all", notes: "Initial Standard rates", effectiveFrom: "", linkedRoles: [{roleId:0,billRate:155},{roleId:1,billRate:200},{roleId:2,billRate:175},{roleId:3,billRate:205},{roleId:4,billRate:190},{roleId:5,billRate:170}] },
  ]},
  { name: "Samsung", projects: 9, rateCards: [
    { title: "Samsung Standard", currency: "USD", offices: "all", notes: "Initial Standard rates", effectiveFrom: "", linkedRoles: [{roleId:0,billRate:165},{roleId:1,billRate:220},{roleId:2,billRate:195},{roleId:3,billRate:225},{roleId:4,billRate:210},{roleId:5,billRate:190}] },
  ]},
  { name: "LinkedIn", projects: 8, rateCards: [
    { title: "LinkedIn Standard", currency: "USD", offices: "all", notes: "Initial Standard rates", effectiveFrom: "", linkedRoles: [{roleId:0,billRate:170},{roleId:1,billRate:215},{roleId:2,billRate:190},{roleId:3,billRate:220},{roleId:4,billRate:205},{roleId:5,billRate:185}] },
  ]},
  { name: "Toyota", projects: 10, rateCards: [
    { title: "Toyota Standard", currency: "USD", offices: "all", notes: "Initial Standard rates", effectiveFrom: "", linkedRoles: [{roleId:0,billRate:165},{roleId:1,billRate:220},{roleId:2,billRate:190},{roleId:3,billRate:225},{roleId:4,billRate:210},{roleId:5,billRate:190}] },
  ]},
  { name: "Patagonia", projects: 6, rateCards: [
    { title: "Patagonia Rates", currency: "USD", offices: "all", notes: "Initial Standard rates", effectiveFrom: "", linkedRoles: [{roleId:0,billRate:155},{roleId:1,billRate:205},{roleId:2,billRate:175},{roleId:3,billRate:215},{roleId:4,billRate:200},{roleId:5,billRate:180}] },
  ]},
]

const BUSINESS_UNITS_FULL = [
  { name: "Airmax", employees: 145, projects: 8, departments: [
    { title: "Marketing Campaign", budget: 450000, spent: 285000, currency: "USD", linkedRoles: [{roleId:0,allocation:15},{roleId:1,allocation:12},{roleId:2,allocation:25},{roleId:3,allocation:10},{roleId:4,allocation:8},{roleId:5,allocation:5}] },
    { title: "Product Launch", budget: 200000, spent: 85000, currency: "USD", linkedRoles: [{roleId:0,allocation:10},{roleId:1,allocation:8},{roleId:2,allocation:18},{roleId:3,allocation:6},{roleId:4,allocation:5},{roleId:5,allocation:3}] },
  ]},
  { name: "LeBron", employees: 98, projects: 12, departments: [
    { title: "Design Development", budget: 380000, spent: 220000, currency: "USD", linkedRoles: [{roleId:0,allocation:12},{roleId:1,allocation:10},{roleId:2,allocation:20},{roleId:3,allocation:8},{roleId:4,allocation:6},{roleId:5,allocation:4}] },
    { title: "Athlete Relations", budget: 150000, spent: 65000, currency: "USD", linkedRoles: [{roleId:0,allocation:8},{roleId:1,allocation:6},{roleId:2,allocation:14},{roleId:3,allocation:5},{roleId:4,allocation:4},{roleId:5,allocation:2}] },
  ]},
  { name: "Jordan", employees: 112, projects: 10, departments: [
    { title: "Heritage Marketing", budget: 420000, spent: 195000, currency: "USD", linkedRoles: [{roleId:0,allocation:14},{roleId:1,allocation:11},{roleId:2,allocation:22},{roleId:3,allocation:9},{roleId:4,allocation:7},{roleId:5,allocation:4}] },
  ]},
  { name: "Nike Runnings", employees: 156, projects: 15, departments: [
    { title: "Performance Research", budget: 520000, spent: 340000, currency: "USD", linkedRoles: [{roleId:0,allocation:18},{roleId:1,allocation:14},{roleId:2,allocation:28},{roleId:3,allocation:12},{roleId:4,allocation:10},{roleId:5,allocation:6}] },
    { title: "Technology Innovation", budget: 250000, spent: 120000, currency: "USD", linkedRoles: [{roleId:0,allocation:12},{roleId:1,allocation:10},{roleId:2,allocation:20},{roleId:3,allocation:8},{roleId:4,allocation:6},{roleId:5,allocation:4}] },
  ]},
  { name: "Nike Football", employees: 78, projects: 6, departments: [
    { title: "Team Partnerships", budget: 280000, spent: 150000, currency: "USD", linkedRoles: [{roleId:0,allocation:8},{roleId:1,allocation:7},{roleId:2,allocation:14},{roleId:3,allocation:6},{roleId:4,allocation:5},{roleId:5,allocation:3}] },
  ]},
  { name: "Nike Sportswear", employees: 134, projects: 11, departments: [
    { title: "Lifestyle Marketing", budget: 395000, spent: 210000, currency: "USD", linkedRoles: [{roleId:0,allocation:13},{roleId:1,allocation:9},{roleId:2,allocation:21},{roleId:3,allocation:8},{roleId:4,allocation:7},{roleId:5,allocation:4}] },
  ]},
  { name: "Nike Training", employees: 89, projects: 7, departments: [
    { title: "Fitness Program", budget: 310000, spent: 160000, currency: "USD", linkedRoles: [{roleId:0,allocation:9},{roleId:1,allocation:8},{roleId:2,allocation:16},{roleId:3,allocation:7},{roleId:4,allocation:5},{roleId:5,allocation:3}] },
  ]},
  { name: "Nike SB", employees: 67, projects: 5, departments: [
    { title: "Skate Culture", budget: 240000, spent: 130000, currency: "USD", linkedRoles: [{roleId:0,allocation:7},{roleId:1,allocation:6},{roleId:2,allocation:12},{roleId:3,allocation:5},{roleId:4,allocation:4},{roleId:5,allocation:2}] },
  ]},
  { name: "Zoom Air", employees: 103, projects: 9, departments: [
    { title: "Technology Development", budget: 360000, spent: 190000, currency: "USD", linkedRoles: [{roleId:0,allocation:11},{roleId:1,allocation:9},{roleId:2,allocation:19},{roleId:3,allocation:8},{roleId:4,allocation:6},{roleId:5,allocation:4}] },
  ]},
  { name: "Converse", employees: 91, projects: 8, departments: [
    { title: "Brand Strategy", budget: 330000, spent: 175000, currency: "USD", linkedRoles: [{roleId:0,allocation:10},{roleId:1,allocation:8},{roleId:2,allocation:17},{roleId:3,allocation:7},{roleId:4,allocation:5},{roleId:5,allocation:3}] },
  ]},
]

const globalSidebarItems = [
  { name: "Dashboard", icon: <Gauge size={16} strokeWidth={1}/> },
  { name: "Report", icon: <BarChart3 size={16} strokeWidth={1}/> },
]
const officeItems = [
  { name: "Dashboard", icon: <Gauge size={16} strokeWidth={1}/> },
  { name: "Schedule", icon: <ScheduleIcon/> },
  { name: "Project plan", icon: <ProjectPlanIcon/> },
  { name: "Project tracker", icon: <FolderOpen size={16} strokeWidth={1}/> },
  { name: "Report", icon: <BarChart3 size={16} strokeWidth={1}/> },
  { name: "Log team", icon: <LogTeamIcon/> },
]
const officeItemsMyTime = [
  ...officeItems.slice(0, 5),
  { name: "My time", icon: <Clock size={16} strokeWidth={1}/> },
  { name: "Log team", icon: <LogTeamIcon/> },
]
const dataHubItems = [
  { name: "People", icon: <Users size={16} strokeWidth={1}/> },
  { name: "Roles", icon: <ChefHat size={16} strokeWidth={1}/> },
  { name: "Projects", icon: <FolderOpen size={16} strokeWidth={1}/> },
  { name: "Clients", icon: <Building2 size={16} strokeWidth={1}/> },
  { name: "Business units", icon: <Building2 size={16} strokeWidth={1}/> },
  { name: "Activity log", icon: <Clock size={16} strokeWidth={1}/> },
]
const LOCATIONS_INIT = [
  { name: "Global", icon: <LayoutGrid size={16} strokeWidth={1}/>, expanded: true, items: globalSidebarItems },
  { name: "New York", icon: <LayoutGrid size={16} strokeWidth={1}/>, expanded: false, items: officeItemsMyTime },
  { name: "London", icon: <LayoutGrid size={16} strokeWidth={1}/>, expanded: false, items: officeItems },
  { name: "Sydney", icon: <LayoutGrid size={16} strokeWidth={1}/>, expanded: false, items: officeItems },
  { name: "Americas", icon: <Layers size={16} strokeWidth={1}/>, expanded: false, children: [
    { name: "Austin", expanded: false, items: officeItems },
    { name: "Los Angeles", expanded: false, items: officeItems },
    { name: "San Francisco", expanded: false, items: officeItems },
    { name: "Chicago", expanded: false, items: officeItems },
  ]},
  { name: "APAC", icon: <Layers size={16} strokeWidth={1}/>, expanded: false, children: [
    { name: "Tokyo", expanded: false, items: officeItems },
    { name: "Singapore", expanded: false, items: officeItems },
    { name: "Melbourne", expanded: false, items: officeItems },
  ]},
  { name: "EMEA", icon: <Layers size={16} strokeWidth={1}/>, expanded: false, children: [
    { name: "Berlin", expanded: false, items: officeItems },
    { name: "Paris", expanded: false, items: officeItems },
    { name: "Madrid", expanded: false, items: officeItems },
  ]},
]

// ── Shared UI ──
function OfficeFilter({ selected, onChange }) {
  const [open, setOpen] = useState(false)
  const isAll = selected.length === ALL_OFFICES.length
  const label = isAll ? "All offices" : selected.length === 1 ? selected[0] : `${selected.length} offices`
  function toggleOffice(o) {
    onChange(prev => {
      if (prev.length === ALL_OFFICES.length) return [o]
      if (prev.includes(o)) { const n = prev.filter(x => x !== o); return n.length === 0 ? [...ALL_OFFICES] : n }
      const n = [...prev, o]; return n.length === ALL_OFFICES.length ? [...ALL_OFFICES] : n
    })
  }
  return (
    <DropdownWrapper open={open} setOpen={setOpen}
      trigger={
        <HoverBtn onClick={() => setOpen(!open)} style={{ ...s.pillBtn(!isAll), gap: 6 }}>
          <Circle size={10} strokeWidth={1.5}/>{label}
          <ChevronDown size={12} strokeWidth={1.5} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}/>
        </HoverBtn>
      }>
      <div style={s.dropdown}>
        <button onClick={() => onChange([...ALL_OFFICES])} style={s.dropdownItem(isAll)}>
          All offices {isAll && <Check size={12} strokeWidth={1.5}/>}
        </button>
        <div style={{ height: 1, background: t.border, margin: "4px 0" }}/>
        {ALL_OFFICES.map(o => (
          <button key={o} onClick={() => toggleOffice(o)} style={s.dropdownItem(selected.includes(o))}>
            {o} {selected.includes(o) && !isAll && <Check size={12} strokeWidth={1.5}/>}
          </button>
        ))}
      </div>
    </DropdownWrapper>
  )
}

function Tabs({ tabs, active, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
      {tabs.map(tab => (
        <HoverBtn key={tab.label} onClick={() => onChange(tab.value)}
          style={{ padding: "4px 10px", borderRadius: 6, border: "none", background: active === tab.value ? t.accent : "transparent", color: active === tab.value ? t.fg : t.secondaryFg, cursor: "pointer", fontSize: 12, fontWeight: active === tab.value ? 500 : 400 }}>
          {tab.label}
        </HoverBtn>
      ))}
    </div>
  )
}

function SectionHeader({ count, label, onAdd }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <h1 style={{ fontSize: 18, fontWeight: 600, color: t.fg }}>{count} {label}</h1>
        <HoverBtn style={s.outlineBtn}><ListFilter size={11} strokeWidth={1.5}/>Filter</HoverBtn>
      </div>
      <button onClick={onAdd} style={s.primaryBtn}><Plus size={16} strokeWidth={2}/></button>
    </div>
  )
}

function Sheet({ title, subtitle, onClose, children, width = 380 }) {
  return (
    <div style={{ width, flexShrink: 0, borderLeft: `1px solid ${t.border}`, background: t.bg, display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${t.border}`, padding: "16px 20px" }}>
        <div>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: t.fg }}>{title}</h2>
          {subtitle && <p style={{ fontSize: 12, color: t.mutedFg, marginTop: 2 }}>{subtitle}</p>}
        </div>
        <HoverBtn onClick={onClose} style={{ ...s.iconBtn, color: t.mutedFg }}><X size={16} strokeWidth={1.5}/></HoverBtn>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>{children}</div>
    </div>
  )
}

function DetailGrid({ items }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16, paddingBottom: 16, borderBottom: `1px solid ${t.border}` }}>
      {items.map((item, i) => (
        <div key={i}>
          <span style={{ fontSize: 11, fontWeight: 500, color: t.mutedFg }}>{item.label}</span>
          <p style={{ fontSize: 13, color: t.fg, marginTop: 2 }}>{item.value}</p>
        </div>
      ))}
    </div>
  )
}

function ActivityTimeline({ entries }) {
  const iconColors = {
    added: { bg: "#052e16", fg: "#4ade80" }, allocation: { bg: "#451a03", fg: "#fb923c" },
    role_change: { bg: "#172554", fg: "#60a5fa" }, office_transfer: { bg: "#2e1065", fg: "#a78bfa" },
    created: { bg: "#052e16", fg: "#4ade80" }, rate_change: { bg: "#451a03", fg: "#fb923c" },
    person_assigned: { bg: "#172554", fg: "#60a5fa" }, person_removed: { bg: "#450a0a", fg: "#f87171" },
    renamed: { bg: "#451a03", fg: "#fb923c" },
  }
  function getIcon(type) {
    if (type === "added" || type === "person_assigned") return <UserPlus size={13} strokeWidth={1.5}/>
    if (type === "role_change" || type === "renamed") return <ArrowRightLeft size={13} strokeWidth={1.5}/>
    if (type === "allocation") return <CalendarClock size={13} strokeWidth={1.5}/>
    if (type === "office_transfer") return <Briefcase size={13} strokeWidth={1.5}/>
    if (type === "created") return <CalendarClock size={13} strokeWidth={1.5}/>
    if (type === "rate_change") return <DollarSign size={13} strokeWidth={1.5}/>
    if (type === "person_removed") return <Users size={13} strokeWidth={1.5}/>
    return <Settings size={13} strokeWidth={1.5}/>
  }
  return (
    <div style={{ position: "relative" }}>
      <div style={{ position: "absolute", left: 13, top: 12, bottom: 12, width: 1, background: t.border }}/>
      {entries.map((e, i) => {
        const col = iconColors[e.type] || { bg: t.muted, fg: t.mutedFg }
        return (
          <div key={i} style={{ display: "flex", gap: 12, paddingBottom: 20 }}>
            <div style={{ width: 26, height: 26, borderRadius: "50%", background: col.bg, color: col.fg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative", zIndex: 1 }}>
              {getIcon(e.type)}
            </div>
            <div style={{ flex: 1, paddingTop: 2 }}>
              <p style={{ fontSize: 13, fontWeight: 500, color: t.fg }}>{e.description}</p>
              {e.details && <p style={{ fontSize: 12, color: t.mutedFg, marginTop: 2 }}>{e.details}</p>}
              <p style={{ fontSize: 11, color: t.mutedFg, marginTop: 4 }}>{e.date}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Modals ──
function AddRoleModal({ onAdd, onClose }) {
  const [name, setName] = useState("")
  const [costRate, setCostRate] = useState("")
  const nameRef = useRef(null)
  useEffect(() => { nameRef.current?.focus() }, [])
  function submit() {
    const n = name.trim()
    if (!n) return
    onAdd({ name: n, costRate: parseFloat(costRate) || 0, activePeople: 0, unassigned: 0 })
    onClose()
  }
  return (
    <div style={{ position: "fixed", inset: 0, background: t.overlayBg, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ background: t.popover, border: `1px solid ${t.border}`, borderRadius: 12, padding: 24, width: 360, boxShadow: `0 8px 32px ${t.shadowDarker}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: t.fg }}>Add role</h2>
          <HoverBtn onClick={onClose} style={{ ...s.iconBtn, color: t.mutedFg }}><X size={16} strokeWidth={1.5}/></HoverBtn>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: t.mutedFg, marginBottom: 6 }}>Role name</label>
          <input ref={nameRef} value={name} onChange={e => setName(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") submit(); if (e.key === "Escape") onClose() }}
            placeholder="e.g. Senior Developer"
            style={{ width: "100%", fontSize: 13, color: t.fg, background: t.muted, border: `1px solid ${t.border}`, borderRadius: 6, padding: "8px 12px", outline: "none", fontFamily: "inherit" }}/>
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: t.mutedFg, marginBottom: 6 }}>Cost rate ($/hr)</label>
          <input type="number" value={costRate} onChange={e => setCostRate(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") submit(); if (e.key === "Escape") onClose() }}
            placeholder="0"
            style={{ width: "100%", fontSize: 13, color: t.fg, background: t.muted, border: `1px solid ${t.border}`, borderRadius: 6, padding: "8px 12px", outline: "none", fontFamily: "inherit" }}/>
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <HoverBtn onClick={onClose} style={{ ...s.outlineBtn, padding: "6px 16px", borderRadius: 6 }}>Cancel</HoverBtn>
          <button onClick={submit} disabled={!name.trim()}
            style={{ padding: "6px 16px", borderRadius: 6, border: "none", background: name.trim() ? t.fg : t.muted, color: name.trim() ? t.bg : t.mutedFg, cursor: name.trim() ? "pointer" : "not-allowed", fontSize: 13, fontWeight: 500 }}>
            Add role
          </button>
        </div>
      </div>
    </div>
  )
}

function AddPersonModal({ roles, departments, onAdd, onClose, type = "employee" }) {
  const [name, setName] = useState("")
  const [roleId, setRoleId] = useState(0)
  const [departmentId, setDepartmentId] = useState(0)
  const [office, setOffice] = useState("New York")
  const nameRef = useRef(null)
  useEffect(() => { nameRef.current?.focus() }, [])
  const officeOpts = ["New York", "London", "Sydney", "Melbourne", "Austin", "Los Angeles", "San Francisco", "Chicago", "Tokyo", "Singapore", "Berlin", "Paris", "Madrid"]
  function submit() {
    const n = name.trim()
    if (!n) return
    onAdd({ name: n, roleId, departmentId, office })
    onClose()
  }
  const sel = { width: "100%", fontSize: 13, color: t.fg, background: t.muted, border: `1px solid ${t.border}`, borderRadius: 6, padding: "8px 12px", outline: "none", fontFamily: "inherit" }
  return (
    <div style={{ position: "fixed", inset: 0, background: t.overlayBg, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ background: t.popover, border: `1px solid ${t.border}`, borderRadius: 12, padding: 24, width: 400, boxShadow: "0 8px 32px rgba(0,0,0,0.6)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: t.fg }}>Add {type === "contractor" ? "contractor" : "employee"}</h2>
          <HoverBtn onClick={onClose} style={{ ...s.iconBtn, color: t.mutedFg }}><X size={16} strokeWidth={1.5}/></HoverBtn>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: t.mutedFg, marginBottom: 6 }}>Full name</label>
            <input ref={nameRef} value={name} onChange={e => setName(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") submit(); if (e.key === "Escape") onClose() }}
              placeholder="e.g. John Smith"
              style={{ width: "100%", fontSize: 13, color: t.fg, background: t.muted, border: `1px solid ${t.border}`, borderRadius: 6, padding: "8px 12px", outline: "none", fontFamily: "inherit" }}/>
          </div>
          <div><label style={{ display: "block", fontSize: 12, fontWeight: 500, color: t.mutedFg, marginBottom: 6 }}>Role</label>
            <select value={roleId} onChange={e => setRoleId(Number(e.target.value))} style={sel}>{roles.map((r,i) => <option key={i} value={i}>{r.name}</option>)}</select></div>
          <div><label style={{ display: "block", fontSize: 12, fontWeight: 500, color: t.mutedFg, marginBottom: 6 }}>Department</label>
            <select value={departmentId} onChange={e => setDepartmentId(Number(e.target.value))} style={sel}>{departments.map((d,i) => <option key={i} value={i}>{d.name}</option>)}</select></div>
          <div><label style={{ display: "block", fontSize: 12, fontWeight: 500, color: t.mutedFg, marginBottom: 6 }}>Office</label>
            <select value={office} onChange={e => setOffice(e.target.value)} style={sel}>{officeOpts.map(o => <option key={o} value={o}>{o}</option>)}</select></div>
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <HoverBtn onClick={onClose} style={{ ...s.outlineBtn, padding: "6px 16px", borderRadius: 6 }}>Cancel</HoverBtn>
          <button onClick={submit} disabled={!name.trim()}
            style={{ padding: "6px 16px", borderRadius: 6, border: "none", background: name.trim() ? t.fg : t.muted, color: name.trim() ? t.bg : t.mutedFg, cursor: name.trim() ? "pointer" : "not-allowed", fontSize: 13, fontWeight: 500 }}>
            Add person
          </button>
        </div>
      </div>
    </div>
  )
}

function AddDepartmentModal({ onAdd, onClose }) {
  const [name, setName] = useState("")
  const ref = useRef(null)
  useEffect(() => { ref.current?.focus() }, [])
  function submit() {
    const n = name.trim()
    if (!n) return
    onAdd({ name: n })
    onClose()
  }
  return (
    <div style={{ position: "fixed", inset: 0, background: t.overlayBg, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ background: t.popover, border: `1px solid ${t.border}`, borderRadius: 12, padding: 24, width: 360, boxShadow: `0 8px 32px ${t.shadowDarker}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: t.fg }}>Add department</h2>
          <HoverBtn onClick={onClose} style={{ ...s.iconBtn, color: t.mutedFg }}><X size={16} strokeWidth={1.5}/></HoverBtn>
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: t.mutedFg, marginBottom: 6 }}>Department name</label>
          <input ref={ref} value={name} onChange={e => setName(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") submit(); if (e.key === "Escape") onClose() }}
            placeholder="e.g. Strategy"
            style={{ width: "100%", fontSize: 13, color: t.fg, background: t.muted, border: `1px solid ${t.border}`, borderRadius: 6, padding: "8px 12px", outline: "none", fontFamily: "inherit" }}/>
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <HoverBtn onClick={onClose} style={{ ...s.outlineBtn, padding: "6px 16px", borderRadius: 6 }}>Cancel</HoverBtn>
          <button onClick={submit} disabled={!name.trim()}
            style={{ padding: "6px 16px", borderRadius: 6, border: "none", background: name.trim() ? t.fg : t.muted, color: name.trim() ? t.bg : t.mutedFg, cursor: name.trim() ? "pointer" : "not-allowed", fontSize: 13, fontWeight: 500 }}>
            Add
          </button>
        </div>
      </div>
    </div>
  )
}

function AddProjectModal({ people, clients, onAdd, onClose }) {
  const [name, setName] = useState("")
  const [code, setCode] = useState("")
  const [clientId, setClientId] = useState(0)
  const [stage, setStage] = useState("planning")
  const [margin, setMargin] = useState("30")
  const [budget, setBudget] = useState("")
  const [startDate, setStartDate] = useState("2026-03-01")
  const [endDate, setEndDate] = useState("2026-12-31")
  const [ownerId, setOwnerId] = useState(0)
  const [office, setOffice] = useState("New York")
  const nameRef = useRef(null)
  useEffect(() => { nameRef.current?.focus() }, [])
  const officeOpts = ["New York", "London", "Sydney", "Melbourne"]
  const inp = { width: "100%", fontSize: 13, color: t.fg, background: t.muted, border: `1px solid ${t.border}`, borderRadius: 6, padding: "8px 12px", outline: "none", fontFamily: "inherit" }
  function submit() {
    const n = name.trim()
    if (!n) return
    onAdd({ name: n, code: code.trim() || `PRJ-${String(Date.now()).slice(-3)}`, clientId, stage, margin: parseFloat(margin)||0, budget: parseFloat(budget)||0, startDate, endDate, ownerId, office })
    onClose()
  }
  return (
    <div style={{ position: "fixed", inset: 0, background: t.overlayBg, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ background: t.popover, border: `1px solid ${t.border}`, borderRadius: 12, padding: 24, width: 480, boxShadow: `0 8px 32px ${t.shadowDarker}`, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: t.fg }}>Add project</h2>
          <HoverBtn onClick={onClose} style={{ ...s.iconBtn, color: t.mutedFg }}><X size={16} strokeWidth={1.5}/></HoverBtn>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
          <div style={{ gridColumn: "1/-1" }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: t.mutedFg, marginBottom: 6 }}>Project name</label>
            <input ref={nameRef} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Q3 Campaign" style={inp}/>
          </div>
          <div><label style={{ display: "block", fontSize: 12, fontWeight: 500, color: t.mutedFg, marginBottom: 6 }}>Code</label><input value={code} onChange={e => setCode(e.target.value)} placeholder="e.g. CAM-001" style={inp}/></div>
          <div><label style={{ display: "block", fontSize: 12, fontWeight: 500, color: t.mutedFg, marginBottom: 6 }}>Client</label><select value={clientId} onChange={e => setClientId(Number(e.target.value))} style={inp}>{clients.map((c,i) => <option key={i} value={i}>{c.name}</option>)}</select></div>
          <div><label style={{ display: "block", fontSize: 12, fontWeight: 500, color: t.mutedFg, marginBottom: 6 }}>Stage</label><select value={stage} onChange={e => setStage(e.target.value)} style={inp}>{["planning","active","on-hold","completed"].map(s2 => <option key={s2} value={s2}>{s2}</option>)}</select></div>
          <div><label style={{ display: "block", fontSize: 12, fontWeight: 500, color: t.mutedFg, marginBottom: 6 }}>Office</label><select value={office} onChange={e => setOffice(e.target.value)} style={inp}>{officeOpts.map(o => <option key={o} value={o}>{o}</option>)}</select></div>
          <div><label style={{ display: "block", fontSize: 12, fontWeight: 500, color: t.mutedFg, marginBottom: 6 }}>Margin (%)</label><input type="number" value={margin} onChange={e => setMargin(e.target.value)} placeholder="30" style={inp}/></div>
          <div><label style={{ display: "block", fontSize: 12, fontWeight: 500, color: t.mutedFg, marginBottom: 6 }}>Budget ($)</label><input type="number" value={budget} onChange={e => setBudget(e.target.value)} placeholder="0" style={inp}/></div>
          <div><label style={{ display: "block", fontSize: 12, fontWeight: 500, color: t.mutedFg, marginBottom: 6 }}>Start date</label><input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ ...inp, colorScheme: "dark" }}/></div>
          <div><label style={{ display: "block", fontSize: 12, fontWeight: 500, color: t.mutedFg, marginBottom: 6 }}>End date</label><input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={{ ...inp, colorScheme: "dark" }}/></div>
          <div style={{ gridColumn: "1/-1" }}><label style={{ display: "block", fontSize: 12, fontWeight: 500, color: t.mutedFg, marginBottom: 6 }}>Owner</label><select value={ownerId} onChange={e => setOwnerId(Number(e.target.value))} style={inp}>{people.map((p,i) => <option key={i} value={i}>{p.name}</option>)}</select></div>
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <HoverBtn onClick={onClose} style={{ ...s.outlineBtn, padding: "6px 16px", borderRadius: 6 }}>Cancel</HoverBtn>
          <button onClick={submit} disabled={!name.trim()}
            style={{ padding: "6px 16px", borderRadius: 6, border: "none", background: name.trim() ? t.fg : t.muted, color: name.trim() ? t.bg : t.mutedFg, cursor: name.trim() ? "pointer" : "not-allowed", fontSize: 13, fontWeight: 500 }}>
            Add project
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Sidebar ──
function SidebarNav({ version, activeItem, onActiveItemChange, onBreadcrumbChange, isDarkMode, onThemeChange }) {
  const [locs, setLocs] = useState(LOCATIONS_INIT)
  const [dataHubExp, setDataHubExp] = useState(true)
  const [dataHubHover, setDataHubHover] = useState(false)
  const [dataHubSettingsOpen, setDataHubSettingsOpen] = useState(false)
  const [visibleDataHubItems, setVisibleDataHubItems] = useState(new Set(dataHubItems.map(item => item.name)))
  const [orgOpen, setOrgOpen] = useState(false)
  const [avatarOpen, setAvatarOpen] = useState(false)

  function setActive(name, bc) { onActiveItemChange(name); onBreadcrumbChange(bc || [name]) }
  function toggleLoc(i) {
    setLocs(prev => prev.map((l, idx) => idx === i ? { ...l, expanded: !l.expanded } : { ...l, expanded: false, children: l.children?.map(c => ({ ...c, expanded: false })) }))
  }
  function toggleChild(pi, ci) {
    setLocs(prev => prev.map((l, i) => i === pi && l.children ? { ...l, children: l.children.map((c, j) => j === ci ? { ...c, expanded: !c.expanded } : { ...c, expanded: false }) } : l))
  }

  const navItemStyle = (active) => ({
    display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "6px 8px",
    borderRadius: 6, border: "none", background: active ? t.accent : "transparent",
    color: active ? t.fg : t.sidebarFg, cursor: "pointer", fontSize: 13,
    fontWeight: active ? 500 : 400, textAlign: "left",
  })

  return (
    <aside style={s.sidebar}>
      <style>{getGlobalStyles(t)}</style>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 12px 4px" }}>
        <DropdownWrapper open={orgOpen} setOpen={setOrgOpen}
          trigger={
            <HoverBtn onClick={() => setOrgOpen(!orgOpen)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 6px", borderRadius: 6, border: "none", background: "transparent", cursor: "pointer", color: t.fg }}>
              <NikeLogo isDarkMode={isDarkMode}/>
              <ChevronDown size={12} strokeWidth={1} color={t.secondaryFg} style={{ transform: orgOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}/>
            </HoverBtn>
          }>
          <div style={{ ...s.dropdown, width: 200 }}>
            <HoverBtn onClick={() => { setActive("Settings"); setOrgOpen(false) }}
              style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "7px 10px", borderRadius: 5, border: "none", background: "transparent", color: t.secondaryFg, cursor: "pointer", fontSize: 13, textAlign: "left" }}>
              <Settings size={14} strokeWidth={1}/> Settings
            </HoverBtn>
          </div>
        </DropdownWrapper>
        <HoverBtn style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 8px", borderRadius: 6, border: "none", background: t.accent, cursor: "pointer" }}>
          <Bell size={14} strokeWidth={1} color={t.mutedFg}/>
          <span style={{ fontSize: 11, fontWeight: 500, color: t.fg }}>23</span>
        </HoverBtn>
      </div>

      <nav style={{ flex: 1, overflowY: "auto", padding: "8px 8px" }}>
        {version === "single" ? (
          officeItems.map(item => (
            <HoverBtn key={item.name} onClick={() => setActive(item.name)} style={navItemStyle(activeItem === item.name)}>
              {item.icon}{item.name}
            </HoverBtn>
          ))
        ) : (
          locs.map((loc, i) => (
            <div key={loc.name} style={{ marginTop: i > 0 ? 2 : 0 }}>
              <HoverBtn onClick={() => toggleLoc(i)}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "6px 8px", borderRadius: 6, border: "none", background: "transparent", cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: t.fgAlpha70 }}>{loc.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: t.fg }}>{loc.name}</span>
                </div>
                <ChevronDown size={13} strokeWidth={1} color={t.sidebarFg} style={{ transform: loc.expanded ? "none" : "rotate(-180deg)", transition: "transform 0.2s" }}/>
              </HoverBtn>
              {loc.items && (
                <Collapsible expanded={loc.expanded}>
                  <div style={{ marginTop: 2 }}>
                    {loc.items.map(item => (
                      <HoverBtn key={item.name} onClick={() => setActive(item.name, [loc.name, item.name])}
                        style={{ ...navItemStyle(activeItem === item.name), paddingLeft: 32 }}>
                        {item.icon}{item.name}
                      </HoverBtn>
                    ))}
                  </div>
                </Collapsible>
              )}
              {loc.children && (
                <Collapsible expanded={loc.expanded}>
                  <div style={{ marginLeft: 18, borderLeft: `1px solid ${t.borderAlpha25}`, marginTop: 2 }}>
                    {loc.children.map((child, ci) => (
                      <div key={child.name}>
                        <HoverBtn onClick={() => toggleChild(i, ci)}
                          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "6px 8px 6px 16px", borderRadius: 6, border: "none", background: "transparent", cursor: "pointer" }}>
                          <span style={{ fontSize: 13, fontWeight: 500, color: t.fg }}>{child.name}</span>
                          <ChevronDown size={13} strokeWidth={1} color={t.sidebarFg} style={{ transform: child.expanded ? "none" : "rotate(-180deg)", transition: "transform 0.2s" }}/>
                        </HoverBtn>
                        {child.items && (
                          <Collapsible expanded={child.expanded}>
                            {child.items.map(item => (
                              <HoverBtn key={item.name} onClick={() => setActive(item.name, [loc.name, child.name, item.name])}
                                style={{ ...navItemStyle(activeItem === item.name), paddingLeft: 46 }}>
                                {item.icon}{item.name}
                              </HoverBtn>
                            ))}
                          </Collapsible>
                        )}
                      </div>
                    ))}
                  </div>
                </Collapsible>
              )}
            </div>
          ))
        )}

        <div style={{ marginTop: 16 }} onMouseEnter={() => setDataHubHover(true)} onMouseLeave={() => setDataHubHover(false)}>
          <HoverBtn onClick={() => setDataHubExp(!dataHubExp)}
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "6px 8px", borderRadius: 6, border: "none", background: "transparent", cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: "rgba(237,237,237,0.7)" }}><Database size={16} strokeWidth={1}/></span>
              <span style={{ fontSize: 13, fontWeight: 500, color: t.fg }}>Data hub</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {dataHubHover && (
                <HoverBtn onClick={(e) => { e.stopPropagation(); setDataHubSettingsOpen(!dataHubSettingsOpen) }} style={{ ...s.iconBtn, width: 20, height: 20, color: t.secondaryFg }}>
                  <MoreVertical size={14} strokeWidth={2}/>
                </HoverBtn>
              )}
              <ChevronDown size={13} strokeWidth={1} color={t.sidebarFg} style={{ transform: dataHubExp ? "none" : "rotate(-180deg)", transition: "transform 0.2s" }}/>
            </div>
          </HoverBtn>
          {dataHubSettingsOpen && (
            <div style={{ position: "absolute", left: 242, top: 240, background: t.bg, border: `1px solid ${t.border}`, borderRadius: 8, boxShadow: "0 8px 24px rgba(0,0,0,0.15)", zIndex: 1000 }}>
              <div style={{ padding: "8px" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: t.mutedFg, padding: "8px 12px" }}>Visible items</div>
                {dataHubItems.map(item => (
                  <label key={item.name} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", cursor: "pointer", borderRadius: 4, fontSize: 13, color: t.fg }}>
                    <input type="checkbox" checked={visibleDataHubItems.has(item.name)} onChange={(e) => {
                      const newSet = new Set(visibleDataHubItems)
                      if (e.target.checked) newSet.add(item.name)
                      else newSet.delete(item.name)
                      setVisibleDataHubItems(newSet)
                    }} style={{ cursor: "pointer" }}/>
                    {item.name}
                  </label>
                ))}
              </div>
            </div>
          )}
          <Collapsible expanded={dataHubExp}>
            <div style={{ marginLeft: 18, marginTop: 8, borderLeft: `1px solid rgba(168,168,168,0.25)` }}>
              {dataHubItems.filter(item => visibleDataHubItems.has(item.name)).map(item => (
                <HoverBtn key={item.name} onClick={() => setActive(item.name, ["Data hub", item.name])}
                  style={{ ...navItemStyle(activeItem === item.name), paddingLeft: 16 }}>
                  {item.icon}{item.name}
                </HoverBtn>
              ))}
            </div>
          </Collapsible>
        </div>
      </nav>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: `1px solid ${t.sidebarBorder}`, padding: "10px 12px" }}>
        <DropdownWrapper open={avatarOpen} setOpen={setAvatarOpen}
          trigger={
            <HoverBtn onClick={() => setAvatarOpen(!avatarOpen)} 
              style={{ display: "flex", alignItems: "center", cursor: "pointer", borderRadius: "50%", border: "none", background: "transparent" }}>
              <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CR-avatar-Bz4EbF5HeVDJiGS7f3cWgRW6XtjgTN.jpeg" alt="CR Avatar" style={{ width: 28, height: 28, borderRadius: "50%", border: `1px solid ${t.border}`, objectFit: "cover" }} />
            </HoverBtn>
          }>
          <div style={{ ...s.dropdown, width: 180, left: 0, right: "auto", top: "auto", bottom: "calc(100% + 4px)", marginTop: 0, marginBottom: 0, padding: "4px 0" }}>
            <button onClick={() => { onThemeChange(false); setAvatarOpen(false) }}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "8px 12px", borderRadius: 0, border: "none", background: "transparent", color: t.secondaryFg, cursor: "pointer", fontSize: 13, textAlign: "left" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><Sun size={16} strokeWidth={2} style={{ color: t.secondaryFg }}/>Light</span>
              <Check size={16} strokeWidth={2} style={{ visibility: !isDarkMode ? "visible" : "hidden", color: t.secondaryFg }}/>
            </button>
            <button onClick={() => { onThemeChange(true); setAvatarOpen(false) }}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "8px 12px", borderRadius: 0, border: "none", background: "transparent", color: t.secondaryFg, cursor: "pointer", fontSize: 13, textAlign: "left" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><Moon size={16} strokeWidth={2} style={{ color: t.secondaryFg }}/>Dark</span>
              <Check size={16} strokeWidth={2} style={{ visibility: isDarkMode ? "visible" : "hidden", color: t.secondaryFg }}/>
            </button>
          </div>
        </DropdownWrapper>
        <HoverBtn style={{ ...s.iconBtn, color: t.mutedFg }}><HelpCircle size={16} strokeWidth={1}/></HoverBtn>
      </div>
    </aside>
  )
}

// ── Role selectors ──
function RoleSelector({ roleId, roles, onChange }) {
  const [open, setOpen] = useState(false)
  return (
    <DropdownWrapper open={open} setOpen={setOpen}
      trigger={
        <HoverBtn onClick={e => { e.stopPropagation(); setOpen(!open) }}
          style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 4, background: t.accent, border: "none", color: t.fg, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
          {roles[roleId]?.name || "Unknown"}<ChevronDown size={11} strokeWidth={1.5} color={t.mutedFg}/>
        </HoverBtn>
      }>
      <div style={{ ...s.dropdown, width: 200 }}>
        {roles.map((r, i) => (
          <button key={i} onClick={e => { e.stopPropagation(); onChange(i); setOpen(false) }} style={s.dropdownItem(i === roleId)}>
            {r.name} {i === roleId && <Check size={13} strokeWidth={1.5}/>}
          </button>
        ))}
      </div>
    </DropdownWrapper>
  )
}

function DeptSelector({ departmentId, departments, onChange }) {
  const [open, setOpen] = useState(false)
  return (
    <DropdownWrapper open={open} setOpen={setOpen}
      trigger={
        <HoverBtn onClick={e => { e.stopPropagation(); setOpen(!open) }}
          style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 4, background: "transparent", border: "none", color: t.fg, fontSize: 13, cursor: "pointer" }}>
          {departments[departmentId]?.name || "Unknown"}<ChevronDown size={11} strokeWidth={1.5} color={t.mutedFg}/>
        </HoverBtn>
      }>
      <div style={{ ...s.dropdown, width: 200 }}>
        {departments.map((d, i) => (
          <button key={i} onClick={e => { e.stopPropagation(); onChange(i); setOpen(false) }} style={s.dropdownItem(i === departmentId)}>
            {d.name} {i === departmentId && <Check size={13} strokeWidth={1.5}/>}
          </button>
        ))}
      </div>
    </DropdownWrapper>
  )
}

// ── Pages ──
function RolesAndRates({ roles, onRolesChange }) {
  const [tab, setTab] = useState("active")
  const [selectedIdx, setSelectedIdx] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const display = tab === "archived" ? [] : roles
  return (
    <div style={{ display: "flex", flex: 1, overflow: "hidden", background: t.bg }}>
      {showModal && <AddRoleModal onAdd={r => onRolesChange([...roles, r])} onClose={() => setShowModal(false)}/>}
      <div style={{ display: "flex", flex: 1, flexDirection: "column", overflow: "hidden" }}>
        <SectionHeader count={roles.length} label="Roles" onAdd={() => setShowModal(true)}/>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px 12px", borderBottom: `1px solid ${t.border}` }}>
          <HoverBtn style={s.pillBtn(false)}><Circle size={10} strokeWidth={1.5}/>All offices<ChevronDown size={11} strokeWidth={1.5}/></HoverBtn>
          <HoverBtn style={s.outlineBtn}><RefreshCw size={11} strokeWidth={1.5}/>Import/Export</HoverBtn>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "12px 24px 8px" }}>
          <HoverBtn style={{ ...s.iconBtn, width: 24, height: 24 }}><Plus size={13} strokeWidth={1.5} color={t.secondaryFg}/></HoverBtn>
          <Tabs active={tab} onChange={setTab} tabs={[{ label: `${roles.length} Active`, value: "active" }, { label: "0 Archived", value: "archived" }, { label: "All", value: "all" }]}/>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "0 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", borderBottom: `1px solid ${t.border}`, padding: "8px 0" }}>
            {["Role","Cost rate","Active people","Unassigned"].map(h => <span key={h} style={{ fontSize: 12, fontWeight: 500, color: t.mutedFg }}>{h}</span>)}
          </div>
          {display.map((role, i) => (
            <HoverRow key={i} selected={selectedIdx === i} onClick={() => setSelectedIdx(i)}
              style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", borderBottom: `1px solid ${t.border}`, padding: "10px 0", cursor: "pointer", transition: "background 0.1s" }}>
              <span onClick={e => e.stopPropagation()} style={{ display: "flex", alignItems: "center" }}>
                <InlineEdit value={role.name} onChange={v => onRolesChange(roles.map((r,j) => j===i ? {...r,name:v} : r))}/>
              </span>
              <span onClick={e => e.stopPropagation()} style={{ display: "flex", alignItems: "center" }}>
                <InlineEditRate value={role.costRate} onChange={v => onRolesChange(roles.map((r,j) => j===i ? {...r,costRate:v} : r))}/>
              </span>
              <span style={{ display: "flex", alignItems: "center", fontSize: 13, color: t.fg }}>{role.activePeople}</span>
              <span style={{ display: "flex", alignItems: "center", fontSize: 13, color: t.fg }}>{role.unassigned}</span>
            </HoverRow>
          ))}
          {tab === "archived" && <div style={{ display: "flex", justifyContent: "center", padding: "64px 0" }}><p style={{ fontSize: 13, color: t.mutedFg }}>No archived roles</p></div>}
        </div>
      </div>
      {selectedIdx !== null && roles[selectedIdx] && (
        <Sheet title={roles[selectedIdx].name} subtitle={`$${roles[selectedIdx].costRate}/hr · ${roles[selectedIdx].activePeople} active`} onClose={() => setSelectedIdx(null)}>
          <DetailGrid items={[
            { label: "Cost rate", value: `$${roles[selectedIdx].costRate}/hr` },
            { label: "Active people", value: roles[selectedIdx].activePeople },
            { label: "Unassigned", value: roles[selectedIdx].unassigned },
            { label: "Status", value: "Active" },
          ]}/>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: t.fg, marginBottom: 12 }}>Activity log</h3>
          <ActivityTimeline entries={ROLE_ACTIVITY[roles[selectedIdx].name] || []}/>
        </Sheet>
      )}
    </div>
  )
}

function People({ roles, departments, onDepartmentsChange, people, onPeopleChange, contractors, onContractorsChange, deptPeopleCounts }) {
  const [tab, setTab] = useState("active")
  const [view, setView] = useState("employees")
  const [selectedPerson, setSelectedPerson] = useState(null)
  const [selectedDept, setSelectedDept] = useState(null)
  const [selectedOffices, setSelectedOffices] = useState([...ALL_OFFICES])
  const [showModal, setShowModal] = useState(false)

  const current = view === "employees" ? people : view === "contractors" ? contractors : people
  const setCurrent = view === "employees" ? onPeopleChange : view === "contractors" ? onContractorsChange : onPeopleChange
  const isAll = selectedOffices.length === ALL_OFFICES.length
  const filtered = isAll ? current : current.filter(p => selectedOffices.includes(p.office))
  const display = tab === "archived" ? [] : filtered

  function handleAdd(person) {
    if (view === "employees") onPeopleChange([...people, person])
    else if (view === "contractors") onContractorsChange([...contractors, person])
    else onDepartmentsChange([...departments, person])
  }

  return (
    <div style={{ display: "flex", flex: 1, overflow: "hidden", background: t.bg }}>
      {showModal && view !== "departments" && <AddPersonModal roles={roles} departments={departments} onAdd={handleAdd} onClose={() => setShowModal(false)} type={view === "contractors" ? "contractor" : "employee"}/>}
      {showModal && view === "departments" && <AddDepartmentModal onAdd={d => onDepartmentsChange([...departments, d])} onClose={() => setShowModal(false)}/>}
      <div style={{ display: "flex", flex: 1, flexDirection: "column", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <h1 style={{ fontSize: 18, fontWeight: 600, color: t.fg }}>
              {view === "departments" ? `${departments.length} Departments` : `${filtered.length} ${view === "employees" ? "Employees" : "Contractors"}`}
            </h1>
            <HoverBtn style={s.outlineBtn}><ListFilter size={11} strokeWidth={1.5}/>Filter</HoverBtn>
          </div>
          <button onClick={() => setShowModal(true)} style={s.primaryBtn}><Plus size={16} strokeWidth={2}/></button>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px 12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <OfficeFilter selected={selectedOffices} onChange={setSelectedOffices}/>
            <div style={{ width: 1, height: 16, background: t.border, margin: "0 6px" }}/>
            {[["employees","Employees"],["contractors","Contractors"]].map(([v,l]) => (
              <HoverBtn key={v} onClick={() => { setView(v); setSelectedPerson(null) }} style={s.pillBtn(view === v)}>
                <Circle size={10} strokeWidth={1.5} style={{ fill: view === v ? t.fg : "none" }}/>{l}
              </HoverBtn>
            ))}
            <div style={{ width: 1, height: 16, background: t.border }}/>
            <HoverBtn onClick={() => { setView("departments"); setSelectedPerson(null) }} style={s.pillBtn(view === "departments")}>
              <Circle size={10} strokeWidth={1.5} style={{ fill: view === "departments" ? t.fg : "none" }}/>Departments
            </HoverBtn>
          </div>
          <HoverBtn style={s.outlineBtn}><RefreshCw size={11} strokeWidth={1.5}/>Import/Export</HoverBtn>
        </div>

        {view !== "departments" ? (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "12px 24px 8px" }}>
              <HoverBtn style={{ ...s.iconBtn, width: 24, height: 24 }}><Plus size={13} strokeWidth={1.5} color={t.secondaryFg}/></HoverBtn>
              <Tabs active={tab} onChange={setTab} tabs={[{ label: `${filtered.length} Active`, value: "active" }, { label: "0 Archived", value: "archived" }, { label: "All", value: "all" }]}/>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "0 24px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1.2fr 1fr", borderBottom: `1px solid ${t.border}`, padding: "8px 0" }}>
                {["Name","Role","Department","Office"].map(h => <span key={h} style={{ fontSize: 12, fontWeight: 500, color: t.mutedFg }}>{h}</span>)}
              </div>
              {display.map((p, i) => (
                <HoverRow key={i} selected={selectedPerson === i} onClick={() => setSelectedPerson(i)}
                  style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1.2fr 1fr", borderBottom: `1px solid ${t.border}`, padding: "10px 0", cursor: "pointer", transition: "background 0.1s" }}>
                  <span onClick={e => e.stopPropagation()} style={{ display: "flex", alignItems: "center" }}>
                    <InlineEdit value={p.name} onChange={v => setCurrent(current.map((x,j) => j===i ? {...x,name:v} : x))} style={{ background: "transparent" }}/>
                  </span>
                  <span style={{ display: "flex", alignItems: "center" }} onClick={e => e.stopPropagation()}>
                    <RoleSelector roleId={p.roleId} roles={roles} onChange={v => setCurrent(current.map((x,j) => j===i ? {...x,roleId:v} : x))}/>
                  </span>
                  <span style={{ display: "flex", alignItems: "center" }} onClick={e => e.stopPropagation()}>
                    <DeptSelector departmentId={p.departmentId} departments={departments} onChange={v => setCurrent(current.map((x,j) => j===i ? {...x,departmentId:v} : x))}/>
                  </span>
                  <span style={{ display: "flex", alignItems: "center", fontSize: 13, color: t.fg }}>{p.office}</span>
                </HoverRow>
              ))}
              {tab === "archived" && <div style={{ display: "flex", justifyContent: "center", padding: "64px 0" }}><p style={{ fontSize: 13, color: t.mutedFg }}>No archived people</p></div>}
            </div>
          </>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "12px 24px 8px" }}>
              <Tabs active="active" onChange={() => {}} tabs={[{ label: `${departments.length} Active`, value: "active" }, { label: "0 Archived", value: "archived" }, { label: "All", value: "all" }]}/>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "0 24px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", borderBottom: `1px solid ${t.border}`, padding: "8px 0" }}>
                {["Name","Active people"].map(h => <span key={h} style={{ fontSize: 12, fontWeight: 500, color: t.mutedFg }}>{h}</span>)}
              </div>
              {departments.map((d, i) => (
                <HoverRow key={i} selected={selectedDept === i} onClick={() => setSelectedDept(i)}
                  style={{ display: "grid", gridTemplateColumns: "2fr 1fr", borderBottom: `1px solid ${t.border}`, padding: "10px 0", cursor: "pointer", transition: "background 0.1s" }}>
                  <span onClick={e => e.stopPropagation()} style={{ display: "flex", alignItems: "center" }}>
                    <InlineEdit value={d.name} onChange={v => onDepartmentsChange(departments.map((x,j) => j===i ? {...x,name:v} : x))}/>
                  </span>
                  <span style={{ display: "flex", alignItems: "center", fontSize: 13, color: t.fg }}>{deptPeopleCounts[i] ?? 0}</span>
                </HoverRow>
              ))}
            </div>
          </>
        )}
      </div>
      {(view === "employees" || view === "contractors") && selectedPerson !== null && current[selectedPerson] && (
        <Sheet title={current[selectedPerson].name} subtitle={`${roles[current[selectedPerson].roleId]?.name} · ${current[selectedPerson].office}`} onClose={() => setSelectedPerson(null)}>
          <DetailGrid items={[
            { label: "Department", value: departments[current[selectedPerson].departmentId]?.name },
            { label: "Office", value: current[selectedPerson].office },
            { label: "Role", value: roles[current[selectedPerson].roleId]?.name },
            { label: "Status", value: "Active" },
          ]}/>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: t.fg, marginBottom: 12 }}>Activity log</h3>
          <ActivityTimeline entries={PERSON_ACTIVITY[current[selectedPerson].name] || []}/>
        </Sheet>
      )}
      {view === "departments" && selectedDept !== null && departments[selectedDept] && (
        <Sheet title={departments[selectedDept].name} subtitle={`${deptPeopleCounts[selectedDept] ?? 0} active people`} onClose={() => setSelectedDept(null)}>
          <DetailGrid items={[{ label: "Active people", value: deptPeopleCounts[selectedDept] ?? 0 }, { label: "Status", value: "Active" }]}/>
        </Sheet>
      )}
    </div>
  )
}

function ProjectTracker({ projects, onProjectsChange, people, clients }) {
  const [showModal, setShowModal] = useState(false)
  return (
    <div style={{ display: "flex", flex: 1, flexDirection: "column", overflow: "hidden", background: t.bg }}>
      {showModal && <AddProjectModal people={people} clients={clients} onAdd={p => onProjectsChange([...projects, p])} onClose={() => setShowModal(false)}/>}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "20px 24px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 4 }}>
          <h1 style={{ fontSize: 18, fontWeight: 600, color: t.fg }}>{projects.length} Projects</h1>
          <HoverBtn style={s.outlineBtn}><ListFilter size={11} strokeWidth={1.5}/>Filter</HoverBtn>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
          <button onClick={() => setShowModal(true)} style={s.primaryBtn}><Plus size={16} strokeWidth={2}/></button>
          <HoverBtn style={s.outlineBtn}><RefreshCw size={11} strokeWidth={1.5}/>Import/Export</HoverBtn>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "0 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 0.6fr 0.8fr 1fr 1fr 1fr 0.8fr", borderBottom: `1px solid ${t.border}`, padding: "8px 0", gap: 8 }}>
          {["Project","Client","Stage","Margin","Budget","Start","End","Owner"].map(h => (
            <span key={h} style={{ fontSize: 12, fontWeight: 500, color: t.mutedFg }}>{h}</span>
          ))}
        </div>
        {projects.map((p, i) => (
          <HoverRow key={i} selected={false} onClick={() => {}}
            style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 0.6fr 0.8fr 1fr 1fr 1fr 0.8fr", borderBottom: `1px solid ${t.border}`, padding: "10px 0", cursor: "default", gap: 8, transition: "background 0.1s" }}>
            <span style={{ display: "flex", alignItems: "center", fontSize: 13, fontWeight: 500, color: t.fg }}>
              <InlineEdit value={p.name} onChange={v => { const u=[...projects]; u[i].name=v; onProjectsChange(u) }} style={{ background: "transparent" }}/>
            </span>
            <span style={{ display: "flex", alignItems: "center", fontSize: 13, color: t.fg }}>{clients[p.clientId]?.name}</span>
            <span style={{ display: "flex", alignItems: "center" }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: STAGE_COLORS[p.stage] }}/>
            </span>
            <span style={{ display: "flex", alignItems: "center", fontSize: 13, color: t.fg }}>{p.margin}%</span>
            <span style={{ display: "flex", alignItems: "center", fontSize: 13, color: t.fg }}>${p.budget.toLocaleString()}</span>
            <span style={{ display: "flex", alignItems: "center", fontSize: 13, color: t.secondaryFg }}>
              {new Date(p.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
            <span style={{ display: "flex", alignItems: "center", fontSize: 13, color: t.secondaryFg }}>
              {new Date(p.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
            <span style={{ display: "flex", alignItems: "center" }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: t.muted, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, color: t.fg }}>
                {people[p.ownerId]?.name.charAt(0) || "?"}
              </div>
            </span>
          </HoverRow>
        ))}
      </div>
    </div>
  )
}

function ProjectsDataHub({ projects, onProjectsChange, people, clients }) {
  const [tab, setTab] = useState("active")
  const [selectedIdx, setSelectedIdx] = useState(null)
  const [selectedOffices, setSelectedOffices] = useState([...ALL_OFFICES])
  const isAll = selectedOffices.length === ALL_OFFICES.length
  const filtered = isAll ? projects : projects.filter(p => selectedOffices.includes(p.office))
  const display = tab === "archived" ? [] : filtered

  return (
    <div style={{ display: "flex", flex: 1, overflow: "hidden", background: t.bg }}>
      <div style={{ display: "flex", flex: 1, flexDirection: "column", overflow: "hidden" }}>
        <SectionHeader count={filtered.length} label="Projects" onAdd={() => {}}/>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px 12px", borderBottom: `1px solid ${t.border}` }}>
          <OfficeFilter selected={selectedOffices} onChange={setSelectedOffices}/>
          <HoverBtn style={s.outlineBtn}><RefreshCw size={11} strokeWidth={1.5}/>Import/Export</HoverBtn>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "12px 24px 8px" }}>
          <HoverBtn style={{ ...s.iconBtn, width: 24, height: 24 }}><Plus size={13} strokeWidth={1.5} color={t.secondaryFg}/></HoverBtn>
          <Tabs active={tab} onChange={setTab} tabs={[{ label: `${filtered.length} Active`, value: "active" }, { label: "0 Archived", value: "archived" }, { label: "All", value: "all" }]}/>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "0 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", borderBottom: `1px solid ${t.border}`, padding: "8px 0" }}>
            {["Project","Code","Client","Office","Owner"].map(h => (
              <span key={h} style={{ fontSize: 12, fontWeight: 500, color: t.mutedFg }}>{h}</span>
            ))}
          </div>
          {display.map((p, idx) => (
            <HoverRow key={idx} selected={selectedIdx === projects.indexOf(p)} onClick={() => setSelectedIdx(projects.indexOf(p))}
              style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", borderBottom: `1px solid ${t.border}`, padding: "10px 0", cursor: "pointer", transition: "background 0.1s" }}>
              <span onClick={e => e.stopPropagation()} style={{ display: "flex", alignItems: "center" }}>
                <InlineEdit value={p.name} onChange={v => { const u=[...projects]; u[projects.indexOf(p)].name=v; onProjectsChange(u) }} style={{ background: "transparent" }}/>
              </span>
              <span style={{ display: "flex", alignItems: "center", fontSize: 13, color: t.secondaryFg }}>{p.code}</span>
              <span style={{ display: "flex", alignItems: "center", fontSize: 13, color: t.fg }}>{clients[p.clientId]?.name}</span>
              <span style={{ display: "flex", alignItems: "center", fontSize: 13, color: t.fg }}>{p.office}</span>
              <span style={{ display: "flex", alignItems: "center" }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: t.muted, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, color: t.fg }}>
                  {people[p.ownerId]?.name.charAt(0) || "?"}
                </div>
              </span>
            </HoverRow>
          ))}
          {tab === "archived" && <div style={{ display: "flex", justifyContent: "center", padding: "64px 0" }}><p style={{ fontSize: 13, color: t.mutedFg }}>No archived projects</p></div>}
        </div>
      </div>
      {selectedIdx !== null && projects[selectedIdx] && (
        <Sheet title={projects[selectedIdx].name} subtitle={`${clients[projects[selectedIdx].clientId]?.name} · ${projects[selectedIdx].office}`} onClose={() => setSelectedIdx(null)}>
          <DetailGrid items={[
            { label: "Code", value: projects[selectedIdx].code },
            { label: "Client", value: clients[projects[selectedIdx].clientId]?.name },
            { label: "Office", value: projects[selectedIdx].office },
            { label: "Owner", value: people[projects[selectedIdx].ownerId]?.name },
            { label: "Stage", value: projects[selectedIdx].stage },
            { label: "Budget", value: `$${projects[selectedIdx].budget.toLocaleString()}` },
          ]}/>
        </Sheet>
      )}
    </div>
  )
}

// ── Clients ──
function CurrencySelector({ value, onChange }) {
  const [open, setOpen] = useState(false)
  return (
    <DropdownWrapper open={open} setOpen={setOpen}
      trigger={
        <HoverBtn onClick={() => setOpen(!open)}
          style={{ display:"flex", alignItems:"center", gap:4, height:28, padding:"0 8px", borderRadius:6, border:`1px solid ${t.border}`, background:"transparent", color:t.secondaryFg, cursor:"pointer", fontSize:12, fontWeight:500 }}>
          {value}<ChevronDown size={12} strokeWidth={1.5}/>
        </HoverBtn>
      }>
      <div style={{ ...s.dropdown, width:100 }}>
        {CURRENCIES.map(c => (
          <button key={c} onClick={() => { onChange(c); setOpen(false) }} style={s.dropdownItem(c===value)}>
            {c}{c===value && <Check size={11} strokeWidth={1.5}/>}
          </button>
        ))}
      </div>
    </DropdownWrapper>
  )
}

function OfficeSelectorRC({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const isAll = value === "all"
  const selected = isAll ? [] : value
  const label = isAll ? "All offices" : selected.length === 0 ? "No offices" : selected.length === ALL_OFFICES.length ? "All offices" : selected.join(", ")
  function toggle(o) {
    if (isAll) { onChange(ALL_OFFICES.filter(x => x !== o)); return }
    const cur = [...selected]
    if (cur.includes(o)) { const n = cur.filter(x => x !== o); onChange(n.length === 0 ? "all" : n) }
    else { const n = [...cur, o]; onChange(n.length === ALL_OFFICES.length ? "all" : n) }
  }
  function isSelected(o) { return isAll || selected.includes(o) }
  return (
    <DropdownWrapper open={open} setOpen={setOpen}
      trigger={
        <HoverBtn onClick={() => setOpen(!open)}
          style={{ display:"flex", alignItems:"center", gap:5, height:28, padding:"0 10px", borderRadius:20, border:`1px solid ${t.border}`, background:"transparent", color:t.secondaryFg, cursor:"pointer", fontSize:12 }}>
          <Circle size={10} strokeWidth={1.5}/>{label}<ChevronDown size={11} strokeWidth={1.5}/>
        </HoverBtn>
      }>
      <div style={{ ...s.dropdown, width:180 }}>
        <button onClick={() => { onChange("all"); setOpen(false) }} style={s.dropdownItem(isAll)}>
          All offices{isAll && <Check size={11} strokeWidth={1.5}/>}
        </button>
        <div style={{ height:1, background:t.border, margin:"4px 0" }}/>
        {ALL_OFFICES.map(o => (
          <button key={o} onClick={() => toggle(o)} style={s.dropdownItem(isSelected(o))}>
            {o}{isSelected(o) && !isAll && <Check size={11} strokeWidth={1.5}/>}
          </button>
        ))}
      </div>
    </DropdownWrapper>
  )
}

function AddRolesBtn({ roles, linkedIds, onAdd, onAddAll }) {
  const [open, setOpen] = useState(false)
  const available = roles.map((r,i) => ({...r,i})).filter(r => !linkedIds.has(r.i))
  return (
    <DropdownWrapper open={open} setOpen={setOpen}
      trigger={
        <HoverBtn onClick={() => setOpen(!open)} disabled={available.length===0}
          style={{ display:"flex", alignItems:"center", gap:6, height:28, padding:"0 10px", borderRadius:6, border:`1px dashed ${t.border}`, background:"transparent", color:t.secondaryFg, cursor:"pointer", fontSize:12, opacity: available.length===0 ? 0.4 : 1 }}>
          <Plus size={12} strokeWidth={1.5}/>Add roles
        </HoverBtn>
      }>
      {available.length > 0 && (
        <div style={{ ...s.dropdown, width:240, maxHeight:320, overflowY:"auto" }}>
          {available.length > 1 && <>
            <button onClick={() => { onAddAll(available.map(r=>r.i)); setOpen(false) }}
              style={{ display:"flex", width:"100%", alignItems:"center", padding:"8px 10px", borderRadius:5, border:"none", background:"transparent", color:t.fg, cursor:"pointer", fontSize:13, fontWeight:500 }}>
              Add all roles
            </button>
            <div style={{ height:1, background:t.border, margin:"4px 0" }}/>
          </>}
          {available.map(r => (
            <button key={r.i} onClick={() => { onAdd(r.i) }}
              style={{ display:"flex", width:"100%", alignItems:"center", gap:8, padding:"8px 10px", borderRadius:5, border:"none", background:"transparent", color:t.secondaryFg, cursor:"pointer", fontSize:13 }}>
              <div style={{ width:14, height:14, borderRadius:3, border:`1px solid ${t.border}` }}/>
              {r.name}
            </button>
          ))}
        </div>
      )}
    </DropdownWrapper>
  )
}

function RateCardSheet({ client, clientIdx, rcIdx, roles, onUpdateClients, onClose }) {
  const rc = client.rateCards[rcIdx]
  function update(updated) {
    onUpdateClients(clientIdx, { ...client, rateCards: client.rateCards.map((r,i) => i===rcIdx ? updated : r) })
  }
  function currSymbol(cur) {
    if (cur==="GBP") return "£"; if (cur==="EUR") return "€"; if (cur==="JPY") return "¥"; return "$"
  }
  const [editingNotes, setEditingNotes] = useState(false)
  const [notesDraft, setNotesDraft] = useState(rc.notes || "Initial Standard rates")
  const notesRef = useRef(null)
  useEffect(() => { if (editingNotes && notesRef.current) { notesRef.current.focus(); notesRef.current.select() } }, [editingNotes])

  return (
    <div style={{ width:"50%", flexShrink:0, borderLeft:`1px solid ${t.border}`, background:t.bg, display:"flex", flexDirection:"column", height:"100%" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:`1px solid ${t.border}`, padding:"16px 20px" }}>
        <h2 style={{ fontSize:15, fontWeight:600, color:t.fg }}>{rc.title}</h2>
        <HoverBtn onClick={onClose} style={{ ...s.iconBtn, color:t.mutedFg }}><X size={16} strokeWidth={1.5}/></HoverBtn>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"16px 20px" }}>
        <div style={{ marginBottom:20 }}>
          <p style={{ fontSize:12, fontWeight:500, color:t.mutedFg, marginBottom:6 }}>Notes</p>
          {editingNotes
            ? <input ref={notesRef} value={notesDraft} onChange={e => setNotesDraft(e.target.value)}
                onBlur={() => { update({...rc, notes:notesDraft}); setEditingNotes(false) }}
                onKeyDown={e => { if (e.key==="Enter"||e.key==="Escape") { update({...rc,notes:notesDraft}); setEditingNotes(false) } }}
                style={{ fontSize:13, color:t.fg, background:"transparent", border:"none", outline:"none", borderBottom:`1px solid ${t.fgAlpha20}`, width:"100%", paddingBottom:2, fontFamily:"inherit" }}/>
            : <button onClick={() => { setNotesDraft(rc.notes||"Initial Standard rates"); setEditingNotes(true) }}
                style={{ fontSize:13, color:t.fg, background:"transparent", border:"none", cursor:"text", padding:0, fontFamily:"inherit" }}>
                {rc.notes || "Initial Standard rates"}
              </button>
          }
        </div>
        <div style={{ display:"flex", gap:16, marginBottom:24, flexWrap:"wrap" }}>
          <div>
            <p style={{ fontSize:12, fontWeight:500, color:t.mutedFg, marginBottom:6 }}>Currency</p>
            <CurrencySelector value={rc.currency} onChange={v => update({...rc,currency:v})}/>
          </div>
          <div>
            <p style={{ fontSize:12, fontWeight:500, color:t.mutedFg, marginBottom:6 }}>Offices</p>
            <OfficeSelectorRC value={rc.offices} onChange={v => update({...rc,offices:v})}/>
          </div>
          <div>
            <p style={{ fontSize:12, fontWeight:500, color:t.mutedFg, marginBottom:6 }}>Effective from</p>
            <HoverBtn style={{ display:"flex", alignItems:"center", gap:6, height:28, padding:"0 10px", borderRadius:6, border:`1px solid ${t.border}`, background:"transparent", color:t.fg, cursor:"pointer", fontSize:13 }}>
              <CalendarClock size={14} strokeWidth={1.5}/>{rc.effectiveFrom || "Select date"}
            </HoverBtn>
          </div>
        </div>
        <div>
          <h3 style={{ fontSize:13, fontWeight:600, color:t.fg, marginBottom:12 }}>Linked Roles</h3>
          {rc.linkedRoles.length > 0 && (
            <>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 100px 28px", gap:8, paddingBottom:8 }}>
                <span style={{ fontSize:11, fontWeight:500, color:t.mutedFg }}>Role</span>
                <span style={{ fontSize:11, fontWeight:500, color:t.mutedFg }}>Bill rate</span>
                <span/>
              </div>
              {rc.linkedRoles.map((lr, i) => (
                <div key={lr.roleId} style={{ display:"grid", gridTemplateColumns:"1fr 100px 28px", gap:8, alignItems:"center", borderTop:`1px solid ${t.border}`, padding:"8px 0" }}>
                  <span style={{ fontSize:13, color:t.fg }}>{roles[lr.roleId]?.name ?? "Unknown"}</span>
                  <div style={{ display:"flex", alignItems:"center" }}>
                    <span style={{ fontSize:12, color:t.mutedFg, paddingRight:2 }}>{currSymbol(rc.currency)}</span>
                    <input type="number" value={lr.billRate}
                      onChange={e => update({...rc, linkedRoles: rc.linkedRoles.map((r,j) => j===i ? {...r,billRate:Number(e.target.value)||0} : r)})}
                      style={{ width:"100%", fontSize:13, color:t.fg, background:"transparent", border:"none", outline:"none", fontFamily:"inherit" }}/>
                  </div>
                  <HoverBtn onClick={() => update({...rc, linkedRoles: rc.linkedRoles.filter((_,j) => j!==i)})}
                    style={{ ...s.iconBtn, width:24, height:24, color:t.mutedFg }}>
                    <X size={12} strokeWidth={1.5}/>
                  </HoverBtn>
                </div>
              ))}
            </>
          )}
          <div style={{ paddingTop:12 }}>
            <AddRolesBtn roles={roles} linkedIds={new Set(rc.linkedRoles.map(r=>r.roleId))}
              onAdd={idx => update({...rc, linkedRoles:[...rc.linkedRoles,{roleId:idx,billRate:roles[idx]?.costRate??0}]})}
              onAddAll={idxs => update({...rc, linkedRoles:[...rc.linkedRoles,...idxs.map(i=>({roleId:i,billRate:roles[i]?.costRate??0}))]})}/>
          </div>
        </div>
      </div>
    </div>
  )
}

function Clients({ roles }) {
  const [tab, setTab] = useState("active")
  const [clients, setClients] = useState(CLIENTS_FULL)
  const [selectedClient, setSelectedClient] = useState(null)
  const [selectedRC, setSelectedRC] = useState(null)
  function updateClient(idx, updated) { setClients(prev => prev.map((c,i) => i===idx ? updated : c)) }
  const client = selectedClient !== null ? clients[selectedClient] : null

  return (
    <div style={{ display:"flex", flex:1, overflow:"hidden", background:t.bg }}>
      <div style={{ display:"flex", flex:1, flexDirection:"column", overflow:"hidden" }}>
        {client === null ? (
          <>
            <SectionHeader count={clients.length} label="Clients" onAdd={() => {}}/>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 24px 12px", borderBottom:`1px solid ${t.border}` }}>
              <HoverBtn style={s.pillBtn(false)}><Circle size={10} strokeWidth={1.5}/>All offices<ChevronDown size={11} strokeWidth={1.5}/></HoverBtn>
              <HoverBtn style={s.outlineBtn}><RefreshCw size={11} strokeWidth={1.5}/>Import/Export</HoverBtn>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:4, padding:"12px 24px 8px" }}>
              <HoverBtn style={{ ...s.iconBtn, width:24, height:24 }}><Plus size={13} strokeWidth={1.5} color={t.secondaryFg}/></HoverBtn>
              <Tabs active={tab} onChange={setTab} tabs={[{label:`${clients.length} Active`,value:"active"},{label:"0 Archived",value:"archived"},{label:"All",value:"all"}]}/>
            </div>
            <div style={{ flex:1, overflowY:"auto", padding:"0 24px" }}>
              <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr", borderBottom:`1px solid ${t.border}`, padding:"8px 0" }}>
                {["Client","Rate cards","Projects"].map(h => <span key={h} style={{ fontSize:12, fontWeight:500, color:t.mutedFg }}>{h}</span>)}
              </div>
              {(tab==="archived"?[]:clients).map((c,i) => (
                <HoverRow key={i} selected={false} onClick={() => { setSelectedClient(i); setSelectedRC(null) }}
                  style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr", borderBottom:`1px solid ${t.border}`, padding:"10px 0", cursor:"pointer", transition:"background 0.1s" }}>
                  <span style={{ display:"flex", alignItems:"center" }} onClick={e => e.stopPropagation()}>
                    <InlineEdit value={c.name} onChange={v => setClients(cl => cl.map((x,j) => j===i ? {...x,name:v} : x))} style={{ background:"transparent" }}/>
                  </span>
                  <span style={{ display:"flex", alignItems:"center", fontSize:13, color:t.fg }}>{c.rateCards.length}</span>
                  <span style={{ display:"flex", alignItems:"center", fontSize:13, color:t.fg }}>{c.projects}</span>
                </HoverRow>
              ))}
              {tab==="archived" && <div style={{ display:"flex", justifyContent:"center", padding:"64px 0" }}><p style={{ fontSize:13, color:t.mutedFg }}>No archived clients</p></div>}
            </div>
          </>
        ) : (
          <>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"20px 24px 16px", borderBottom:`1px solid ${t.border}` }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <HoverBtn onClick={() => { setSelectedClient(null); setSelectedRC(null) }} style={{ ...s.iconBtn, color:t.secondaryFg }}>
                  <ChevronLeft size={18} strokeWidth={1.5}/>
                </HoverBtn>
                <h1 style={{ fontSize:18, fontWeight:600, color:t.fg }}>{client.name}</h1>
              </div>
              <button style={s.primaryBtn}><Plus size={16} strokeWidth={2}/></button>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:4, padding:"12px 24px 8px" }}>
              <Tabs active={tab} onChange={setTab} tabs={[{label:`${client.rateCards.length} Active`,value:"active"},{label:"0 Archived",value:"archived"},{label:"All",value:"all"}]}/>
            </div>
            <div style={{ flex:1, overflowY:"auto", padding:"0 24px" }}>
              <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", borderBottom:`1px solid ${t.border}`, padding:"8px 0" }}>
                {["Rate Card","Currency","Offices","Roles"].map(h => <span key={h} style={{ fontSize:12, fontWeight:500, color:t.mutedFg }}>{h}</span>)}
              </div>
              {client.rateCards.map((rc, i) => (
                <HoverRow key={i} selected={selectedRC===i} onClick={() => setSelectedRC(i)}
                  style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", borderBottom:`1px solid ${t.border}`, padding:"10px 0", cursor:"pointer", transition:"background 0.1s" }}>
                  <span style={{ fontSize:13, fontWeight:500, color:t.fg, display:"flex", alignItems:"center" }}>{rc.title}</span>
                  <span style={{ fontSize:13, color:t.fg, display:"flex", alignItems:"center" }}>{rc.currency}</span>
                  <span style={{ fontSize:13, color:t.fg, display:"flex", alignItems:"center" }}>{rc.offices==="all"?"All":rc.offices.length}</span>
                  <span style={{ fontSize:13, color:t.fg, display:"flex", alignItems:"center" }}>{rc.linkedRoles.length}</span>
                </HoverRow>
              ))}
            </div>
          </>
        )}
      </div>
      {client !== null && selectedRC !== null && (
        <RateCardSheet client={client} clientIdx={selectedClient} rcIdx={selectedRC} roles={roles} onUpdateClients={updateClient} onClose={() => setSelectedRC(null)}/>
      )}
    </div>
  )
}

function BusinessUnits({ roles }) {
  const [tab, setTab] = useState("active")
  const [units, setUnits] = useState(BUSINESS_UNITS_FULL)
  const [selectedUnit, setSelectedUnit] = useState(null)
  const [selectedDept, setSelectedDept] = useState(null)
  function updateUnit(idx, updated) { setUnits(prev => prev.map((u,i) => i===idx ? updated : u)) }
  const unit = selectedUnit !== null ? units[selectedUnit] : null

  return (
    <div style={{ display:"flex", flex:1, overflow:"hidden", background:t.bg }}>
      <div style={{ display:"flex", flex:1, flexDirection:"column", overflow:"hidden" }}>
        {unit === null ? (
          <>
            <SectionHeader count={units.length} label="Business units" onAdd={() => {}}/>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 24px 12px", borderBottom:`1px solid ${t.border}` }}>
              <HoverBtn style={s.pillBtn(false)}><Circle size={10} strokeWidth={1.5}/>All regions<ChevronDown size={11} strokeWidth={1.5}/></HoverBtn>
              <HoverBtn style={s.outlineBtn}><RefreshCw size={11} strokeWidth={1.5}/>Import/Export</HoverBtn>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:4, padding:"12px 24px 8px" }}>
              <HoverBtn style={{ ...s.iconBtn, width:24, height:24 }}><Plus size={13} strokeWidth={1.5} color={t.secondaryFg}/></HoverBtn>
              <Tabs active={tab} onChange={setTab} tabs={[{label:`${units.length} Active`,value:"active"},{label:"0 Archived",value:"archived"},{label:"All",value:"all"}]}/>
            </div>
            <div style={{ flex:1, overflowY:"auto", padding:"0 24px" }}>
              <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", borderBottom:`1px solid ${t.border}`, padding:"8px 0" }}>
                {["Business Unit","Employees","Projects","Departments"].map(h => <span key={h} style={{ fontSize:12, fontWeight:500, color:t.mutedFg }}>{h}</span>)}
              </div>
              {(tab==="archived"?[]:units).map((u,i) => (
                <HoverRow key={i} selected={false} onClick={() => { setSelectedUnit(i); setSelectedDept(null) }}
                  style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", borderBottom:`1px solid ${t.border}`, padding:"10px 0", cursor:"pointer", transition:"background 0.1s" }}>
                  <span style={{ display:"flex", alignItems:"center" }} onClick={e => e.stopPropagation()}>
                    <InlineEdit value={u.name} onChange={v => setUnits(ul => ul.map((x,j) => j===i ? {...x,name:v} : x))} style={{ background:"transparent" }}/>
                  </span>
                  <span style={{ display:"flex", alignItems:"center", fontSize:13, color:t.fg }}>{u.employees}</span>
                  <span style={{ display:"flex", alignItems:"center", fontSize:13, color:t.fg }}>{u.projects}</span>
                  <span style={{ display:"flex", alignItems:"center", fontSize:13, color:t.fg }}>{u.departments.length}</span>
                </HoverRow>
              ))}
              {tab==="archived" && <div style={{ display:"flex", justifyContent:"center", padding:"64px 0" }}><p style={{ fontSize:13, color:t.mutedFg }}>No archived business units</p></div>}
            </div>
          </>
        ) : (
          <>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"20px 24px 16px", borderBottom:`1px solid ${t.border}` }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <HoverBtn onClick={() => { setSelectedUnit(null); setSelectedDept(null) }} style={{ ...s.iconBtn, color:t.secondaryFg }}>
                  <ChevronLeft size={18} strokeWidth={1.5}/>
                </HoverBtn>
                <h1 style={{ fontSize:18, fontWeight:600, color:t.fg }}>{unit.name}</h1>
              </div>
              <button style={s.primaryBtn}><Plus size={16} strokeWidth={2}/></button>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:4, padding:"12px 24px 8px" }}>
              <Tabs active={tab} onChange={setTab} tabs={[{label:`${unit.departments.length} Active`,value:"active"},{label:"0 Archived",value:"archived"},{label:"All",value:"all"}]}/>
            </div>
            <div style={{ flex:1, overflowY:"auto", padding:"0 24px" }}>
              <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", borderBottom:`1px solid ${t.border}`, padding:"8px 0" }}>
                {["Department","Budget","Spent","Roles"].map(h => <span key={h} style={{ fontSize:12, fontWeight:500, color:t.mutedFg }}>{h}</span>)}
              </div>
              {unit.departments.map((dept, i) => (
                <HoverRow key={i} selected={selectedDept===i} onClick={() => setSelectedDept(i)}
                  style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", borderBottom:`1px solid ${t.border}`, padding:"10px 0", cursor:"pointer", transition:"background 0.1s" }}>
                  <span style={{ fontSize:13, fontWeight:500, color:t.fg, display:"flex", alignItems:"center" }}>{dept.title}</span>
                  <span style={{ fontSize:13, color:t.fg, display:"flex", alignItems:"center" }}>${dept.budget.toLocaleString()}</span>
                  <span style={{ fontSize:13, color:t.fg, display:"flex", alignItems:"center" }}>${dept.spent.toLocaleString()}</span>
                  <span style={{ fontSize:13, color:t.fg, display:"flex", alignItems:"center" }}>{dept.linkedRoles.length}</span>
                </HoverRow>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function ActivityLog() {
  const [sourceFilter, setSourceFilter] = useState("all")
  const [filterOpen, setFilterOpen] = useState(false)
  const filtered = sourceFilter==="all" ? ACTIVITY_LOG_DATA : ACTIVITY_LOG_DATA.filter(e => e.source===sourceFilter)
  const sourceLabel = { all:"All sources", people:"People", roles:"Roles", departments:"Departments" }
  function typeIcon(type) {
    if (type==="person_assigned"||type==="added") return <UserPlus size={13} strokeWidth={1.5}/>
    if (type==="role_change"||type==="renamed") return <ArrowRightLeft size={13} strokeWidth={1.5}/>
    if (type==="allocation") return <Briefcase size={13} strokeWidth={1.5}/>
    if (type==="rate_change") return <DollarSign size={13} strokeWidth={1.5}/>
    return <CalendarClock size={13} strokeWidth={1.5}/>
  }
  return (
    <div style={{ display:"flex", flex:1, flexDirection:"column", overflow:"hidden", background:t.bg }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"20px 24px 16px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <h1 style={{ fontSize:18, fontWeight:600, color:t.fg }}>{filtered.length} Events</h1>
        </div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:8, padding:"0 24px 12px", borderBottom:`1px solid ${t.border}` }}>
        <DropdownWrapper open={filterOpen} setOpen={setFilterOpen}
          trigger={
            <HoverBtn onClick={() => setFilterOpen(!filterOpen)} style={s.pillBtn(sourceFilter!=="all")}>
              {sourceLabel[sourceFilter]}<ChevronDown size={12} strokeWidth={1.5} style={{ transform:filterOpen?"rotate(180deg)":"none", transition:"transform 0.2s" }}/>
            </HoverBtn>
          }>
          <div style={s.dropdown}>
            <button onClick={() => { setSourceFilter("all"); setFilterOpen(false) }} style={s.dropdownItem(sourceFilter==="all")}>
              All sources {sourceFilter==="all" && <Check size={12} strokeWidth={1.5}/>}
            </button>
            <div style={{ height:1, background:t.border, margin:"4px 0" }}/>
            {["people","roles","departments"].map(s2 => (
              <button key={s2} onClick={() => { setSourceFilter(s2); setFilterOpen(false) }} style={s.dropdownItem(sourceFilter===s2)}>
                {sourceLabel[s2]} {sourceFilter===s2 && <Check size={12} strokeWidth={1.5}/>}
              </button>
            ))}
          </div>
        </DropdownWrapper>
      </div>
      <div style={{ flex:1, overflowY:"auto" }}>
        <div style={{ display:"grid", gridTemplateColumns:"140px 90px 1fr 2fr 1.5fr", borderBottom:`1px solid ${t.border}`, padding:"8px 24px" }}>
          {["Date","Source","Entity","Action","Details"].map(h => <span key={h} style={{ fontSize:12, fontWeight:500, color:t.mutedFg }}>{h}</span>)}
        </div>
        {filtered.map((e, i) => (
          <HoverRow key={i} selected={false} onClick={() => {}}
            style={{ display:"grid", gridTemplateColumns:"140px 90px 1fr 2fr 1.5fr", borderBottom:`1px solid ${t.border}`, padding:"10px 24px", transition:"background 0.1s" }}>
            <span style={{ fontSize:12, color:t.mutedFg, display:"flex", alignItems:"center" }}>{e.date}</span>
            <span style={{ display:"flex", alignItems:"center" }}>
              <span style={{ fontSize:11, fontWeight:500, color:t.mutedFg, background:t.muted, padding:"2px 8px", borderRadius:20 }}>{sourceLabel[e.source]}</span>
            </span>
            <span style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, fontWeight:500, color:t.fg }}>
              <span style={{ display:"flex", alignItems:"center", justifyContent:"center", width:20, height:20, borderRadius:"50%", background:t.muted, color:t.mutedFg, flexShrink:0 }}>
                {typeIcon(e.type)}
              </span>
              {e.entity}
            </span>
            <span style={{ display:"flex", alignItems:"center", fontSize:13, color:t.fg }}>{e.description}</span>
            <span style={{ display:"flex", alignItems:"center", fontSize:12, color:t.mutedFg }}>{e.details||"—"}</span>
          </HoverRow>
        ))}
      </div>
    </div>
  )
}

// ── Placeholder views ──
function GridBg() {
  return (
    <>
      <path d="M29.6517 39.8222H439.015" stroke="#80858D" strokeOpacity="0.4" strokeWidth="0.93037" strokeLinecap="round" strokeDasharray="3.72 4.65"/>
      <path d="M29.6517 242.178H439.015" stroke="#80858D" strokeOpacity="0.4" strokeWidth="0.93037" strokeLinecap="round" strokeDasharray="3.72 4.65"/>
      <path d="M66.8666 21.2148V260.785" stroke="#80858D" strokeOpacity="0.4" strokeWidth="0.93037" strokeLinecap="round" strokeDasharray="3.72 4.65"/>
      <path d="M401.8 21.2148V260.785" stroke="#80858D" strokeOpacity="0.4" strokeWidth="0.93037" strokeLinecap="round" strokeDasharray="3.72 4.65"/>
      <path d="M234.333 11.9111V270.089" stroke="#80858D" strokeOpacity="0.4" strokeWidth="0.697778" strokeDasharray="1.4 3.26"/>
      <path d="M11.0443 141H457.622" stroke="#80858D" strokeOpacity="0.4" strokeWidth="0.697778" strokeDasharray="1.4 3.26"/>
    </>
  )
}

function ViewWrapper({ breadcrumb, children }) {
  return (
    <div style={{ display:"flex", flex:1, flexDirection:"column", background:t.bg }}>
      <div style={{ padding:"20px 24px 16px" }}>
        <h2 style={{ fontSize:18, fontWeight:600, color:t.fg }}>{breadcrumb[breadcrumb.length-1]}</h2>
        <p style={{ fontSize:13, color:t.mutedFg, marginTop:4 }}>{breadcrumb.length>=2 ? `The ${breadcrumb[breadcrumb.length-1]} for ${breadcrumb[0]}` : ""}</p>
      </div>
      <div style={{ display:"flex", flex:1, alignItems:"center", justifyContent:"center", background:t.bg }}>{children}</div>
    </div>
  )
}

function DashboardView({ breadcrumb }) {
  return (
    <ViewWrapper breadcrumb={breadcrumb}>
      <svg width="467" height="284" viewBox="0 0 467 284" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#db-clip)"><GridBg/>
          <path d="M294.167 190.52V199.214L266.389 213.103V204.409L286.097 194.562L294.167 190.52Z" stroke="#BCBCBC" strokeWidth="0.694444" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M266.388 204.409V213.103L173.917 159.714V118.437L199.611 156.853L207.361 149.103L220.152 136.298L242.68 169.492L266.388 204.409Z" stroke="#BCBCBC" strokeWidth="0.694444" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M273.625 110.715L256.084 119.478L248.514 123.27L245.847 124.603L245.806 124.534L245.264 123.742L237.778 112.548L225.973 94.8951L220.153 86.1866L247.931 72.2978L273.625 110.715Z" stroke="#BCBCBC" strokeWidth="0.694444" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M294.167 122.576L267.292 136.006L266.389 136.465L251.722 127.992L245.847 124.603L248.514 123.27L256.084 119.478L273.625 110.715L294.167 122.576Z" stroke="#BCBCBC" strokeWidth="0.694444" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M216.292 90.1589L207.833 98.8672L201.944 104.923L201.694 105.187L194.472 112.617L192.166 109.312L173.917 83.0757L201.694 69.1867L216.292 90.1589Z" stroke="#BCBCBC" strokeWidth="0.694444" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M266.388 136.465V189.52L259.319 179.09L231.819 138.534L227.722 132.506L223.305 125.992L218.097 118.312L213.792 122.631L201.694 134.77L197.68 138.798L181.375 114.714L173.917 103.7V83.0756L192.166 109.312L194.472 112.617L201.694 105.187L201.944 104.923L207.833 98.8672L216.292 90.1588L220.152 86.1866L225.972 94.8951L237.778 112.548L245.264 123.742L245.805 124.534L245.847 124.603L251.722 127.992L266.388 136.465Z" stroke="#BCBCBC" strokeWidth="0.694444" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M294.167 122.576V175.631L286.625 179.409L272.278 186.576L266.389 189.52V136.465L267.292 136.006L294.167 122.576Z" stroke="#BCBCBC" strokeWidth="0.694444" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M294.167 190.52L286.097 194.562L266.389 204.409L242.681 169.492L220.153 136.298L222.236 135.256L227.723 132.506L231.82 138.534L259.32 179.09L266.389 189.52L272.278 186.576L286.625 179.409L294.167 190.52Z" stroke="#BCBCBC" strokeWidth="0.694444" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M223.305 125.992L217.86 128.714L201.694 136.798L197.68 138.798L201.694 134.77L213.791 122.631L218.096 118.312L223.305 125.992Z" stroke="#BCBCBC" strokeWidth="0.694444" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M222.236 135.256L220.152 136.298L207.361 149.103L199.611 156.853L173.917 118.437L181.375 114.714L197.68 138.798L201.694 136.798L217.861 128.714L222.236 135.256Z" stroke="#BCBCBC" strokeWidth="0.694444" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
        <defs><clipPath id="db-clip"><rect width="467" height="284" fill="white"/></clipPath></defs>
      </svg>
    </ViewWrapper>
  )
}

function ScheduleView({ breadcrumb }) {
  return (
    <ViewWrapper breadcrumb={breadcrumb}>
      <svg width="467" height="284" viewBox="0 0 467 284" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#sc-clip)"><GridBg/>
          <path d="M215.41 197.031V212.37L175.333 189.229V173.902L215.41 197.031Z" stroke="#BCBCBC" strokeWidth="0.604839" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M242.499 174.026V189.341L226.628 180.184L223.773 178.526L186.551 157.043L183.708 155.397L162.357 143.071V127.756L242.499 174.026Z" stroke="#BCBCBC" strokeWidth="0.604839" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M282.575 158.845V174.172L266.692 164.99L263.837 163.345L186.551 118.72L183.696 117.075L162.357 104.748V89.4339L282.575 158.845Z" stroke="#BCBCBC" strokeWidth="0.604839" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M239.603 188.019V200.273L215.41 212.37V197.031L225.365 192.047L236.748 186.362L239.603 188.019Z" stroke="#BCBCBC" strokeWidth="0.604839" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M266.692 164.99V177.244L242.499 189.341V174.027L263.837 163.345L266.692 164.99Z" stroke="#BCBCBC" strokeWidth="0.604839" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M306.769 146.748L282.575 158.845L162.357 89.4339L186.551 77.3371L306.769 146.748Z" stroke="#BCBCBC" strokeWidth="0.604839" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M306.769 146.748V162.075L282.575 174.172V158.845L306.769 146.748Z" stroke="#BCBCBC" strokeWidth="0.604839" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M263.837 163.345L242.499 174.027L162.357 127.757L183.696 117.075L186.551 118.72L263.837 163.345Z" stroke="#BCBCBC" strokeWidth="0.604839" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M236.749 186.362L225.365 192.047L215.41 197.031L175.333 173.902L196.684 163.233L199.527 164.878L236.749 186.362Z" stroke="#BCBCBC" strokeWidth="0.604839" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
        <defs><clipPath id="sc-clip"><rect width="467" height="284" fill="white"/></clipPath></defs>
      </svg>
    </ViewWrapper>
  )
}

function ProjectPlanView({ breadcrumb }) {
  return (
    <ViewWrapper breadcrumb={breadcrumb}>
      <svg width="467" height="284" viewBox="0 0 467 284" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#pp-clip)"><GridBg/>
          <path d="M298.558 116.042V154.48L281.813 164.143V125.706L298.558 116.042Z" stroke="#BCBCBC" strokeWidth="0.721154" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M252.968 141.369V149.72L281.814 164.143V125.706L270.65 120.124V132.153L269.713 132.701L253.905 141.831L252.968 141.369Z" stroke="#BCBCBC" strokeWidth="0.721154" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M225.997 93.8883V125.908L241.805 116.792L242.742 116.244V84.2249L225.997 93.8883Z" stroke="#BCBCBC" strokeWidth="0.721154" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M253.905 109.797V141.831L269.712 132.701L270.65 132.153V100.134L253.905 109.797Z" stroke="#BCBCBC" strokeWidth="0.721154" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M225.06 125.446V127.407L252.969 141.369L253.906 141.83V109.797L242.742 104.215V116.244L241.805 116.792L225.998 125.907L225.06 125.446Z" stroke="#BCBCBC" strokeWidth="0.721154" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M197.151 79.4653L213.896 87.8451L225.997 93.8884L242.742 84.2249L213.896 69.8019L197.151 79.4653Z" stroke="#BCBCBC" strokeWidth="0.721154" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M197.152 79.4655V91.4944L213.897 99.8741L214.834 100.336V120.326L225.06 125.446L225.998 125.908V93.8885L213.897 87.8454L197.152 79.4655Z" stroke="#BCBCBC" strokeWidth="0.721154" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M198.089 109.999V212.475L214.834 202.811V100.335L213.896 100.883L198.089 109.999Z" stroke="#BCBCBC" strokeWidth="0.721154" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M169.243 95.5759V198.052L198.09 212.475V109.999L197.152 109.537L185.989 103.956L169.243 95.5759Z" stroke="#BCBCBC" strokeWidth="0.721154" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M169.242 95.5759L185.988 103.956L197.151 109.537L198.089 109.999L213.896 100.883L214.834 100.335L213.896 99.874L197.151 91.4942L185.988 85.9123L169.242 95.5759Z" stroke="#BCBCBC" strokeWidth="0.721154" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M242.741 86.1862V104.215L253.905 109.797L270.65 100.133L242.741 86.1862Z" stroke="#BCBCBC" strokeWidth="0.721154" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M270.65 102.095V120.124L281.813 125.706L298.558 116.042L270.65 102.095Z" stroke="#BCBCBC" strokeWidth="0.721154" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
        <defs><clipPath id="pp-clip"><rect width="467" height="284" fill="white"/></clipPath></defs>
      </svg>
    </ViewWrapper>
  )
}

function ReportView({ breadcrumb }) {
  return (
    <ViewWrapper breadcrumb={breadcrumb}>
      <svg width="467" height="284" viewBox="0 0 467 284" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#rp-clip)"><GridBg/>
          <path d="M202.91 163.395V179.72L183.96 168.77V152.458L202.91 163.395Z" stroke="#BCBCBC" strokeWidth="0.625" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M202.91 136.207V157.957L189.01 149.932L183.96 147.02V125.257L202.91 136.207Z" stroke="#BCBCBC" strokeWidth="0.625" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M202.91 92.695V130.77L189.01 122.732L183.96 119.82V81.7575L202.91 92.695Z" stroke="#BCBCBC" strokeWidth="0.625" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M217.448 144.595L217.21 144.72L212.398 147.12V153.22L208.96 154.933L202.91 157.958V136.208L208.96 133.183L212.398 131.47V141.683L217.448 144.595Z" stroke="#BCBCBC" strokeWidth="0.625" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M231.347 158.07V196.133L212.397 185.195V147.12L218.047 150.382L223.097 153.308L227.91 156.083L231.347 158.07Z" stroke="#BCBCBC" strokeWidth="0.625" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M240.835 147.882V153.333L237.397 155.045L231.347 158.07L227.91 156.083L223.097 153.308L218.047 150.382L212.397 147.12L217.21 144.72L217.447 144.595L223.097 147.858L231.347 152.62L237.397 149.595L240.835 147.882Z" stroke="#BCBCBC" strokeWidth="0.625" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M240.835 185.295L245.885 188.207L240.835 190.732V191.395L231.348 196.133V158.07L237.398 155.045L240.835 153.332V158.095L245.885 161.007L240.835 163.532V185.295Z" stroke="#BCBCBC" strokeWidth="0.625" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M284.785 189.17V200.058L259.785 212.558V201.67L284.785 189.17Z" stroke="#BCBCBC" strokeWidth="0.625" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M259.784 201.67V212.558L240.835 201.608V190.732L241.447 191.082L259.784 201.67Z" stroke="#BCBCBC" strokeWidth="0.625" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M284.784 189.17L259.784 201.67L241.447 191.083L240.835 190.733L245.885 188.208L246.497 188.558L259.784 196.233L269.635 191.308L279.735 186.258L284.784 189.17Z" stroke="#BCBCBC" strokeWidth="0.625" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M284.785 161.982V183.732L279.735 186.257L269.635 191.308L259.785 196.233V174.482L265.835 171.457L284.785 161.982Z" stroke="#BCBCBC" strokeWidth="0.625" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M259.784 174.483V196.233L246.497 188.558L245.885 188.207L240.835 185.295V163.532L256.347 172.495L259.784 174.483Z" stroke="#BCBCBC" strokeWidth="0.625" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M284.784 161.983L265.835 171.458L259.784 174.483L256.347 172.495L240.835 163.533L245.885 161.007L256.347 167.058L259.784 169.045L265.835 166.02L279.735 159.07L284.784 161.983Z" stroke="#BCBCBC" strokeWidth="0.625" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M284.785 113.032V156.545L279.735 159.07L265.835 166.02L259.785 169.045V125.532L265.835 122.508L284.785 113.032Z" stroke="#BCBCBC" strokeWidth="0.625" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M284.784 113.032L265.835 122.508L259.784 125.532L256.347 123.545L251.535 120.77L246.497 117.858L240.835 114.595L245.647 112.183L250.697 109.67L256.347 106.845L265.835 102.095L284.784 113.032Z" stroke="#BCBCBC" strokeWidth="0.625" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M256.348 96.6202V106.845L250.698 109.67L245.648 112.183L240.835 114.595V120.695L237.398 122.407L231.348 125.433V109.12L241.21 104.183L256.348 96.6202Z" stroke="#BCBCBC" strokeWidth="0.625" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M212.398 98.17V114.482L217.448 117.395L217.198 117.52L212.398 119.92V126.032L208.96 127.745L202.91 130.77V92.695L208.96 89.67L227.91 80.195V90.42L212.398 98.17Z" stroke="#BCBCBC" strokeWidth="0.625" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M227.91 80.195L208.96 89.67L202.91 92.695L183.96 81.7575L208.96 69.2575L227.91 80.195Z" stroke="#BCBCBC" strokeWidth="0.625" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M212.397 126.032V131.47L208.96 133.182L202.91 136.207L183.96 125.257L189.01 122.732L202.91 130.77L208.96 127.745L212.397 126.032Z" stroke="#BCBCBC" strokeWidth="0.625" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M231.347 109.12V125.432L223.11 120.67L217.447 117.395L212.397 114.482V98.1699L227.91 107.132L231.347 109.12Z" stroke="#BCBCBC" strokeWidth="0.625" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M256.347 96.6199L241.21 104.182L231.347 109.12L227.91 107.132L212.397 98.1699L227.91 90.4197L237.397 85.6699L256.347 96.6199Z" stroke="#BCBCBC" strokeWidth="0.625" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M259.784 125.532V169.045L256.347 167.058L245.885 161.007L240.835 158.095V114.595L246.497 117.858L251.535 120.77L256.347 123.545L259.784 125.532Z" stroke="#BCBCBC" strokeWidth="0.625" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M231.347 130.87V152.62L223.097 147.857L217.447 144.595L212.397 141.682V119.92L218.06 123.195L223.11 126.107L227.91 128.882L231.347 130.87Z" stroke="#BCBCBC" strokeWidth="0.625" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M240.835 120.695V126.132L237.397 127.845L231.347 130.87L227.91 128.882L223.11 126.107L218.06 123.195L212.397 119.92L217.197 117.52L217.447 117.395L223.11 120.67L231.347 125.432L237.397 122.407L240.835 120.695Z" stroke="#BCBCBC" strokeWidth="0.625" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M240.835 126.132V147.882L237.398 149.595L231.348 152.62V130.87L237.398 127.845L240.835 126.132Z" stroke="#BCBCBC" strokeWidth="0.625" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M212.398 158.657V174.983L202.91 179.72V163.395L212.398 158.657Z" stroke="#BCBCBC" strokeWidth="0.625" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M212.397 153.22V158.657L202.91 163.395L183.96 152.458L189.01 149.933L202.91 157.958L208.96 154.933L212.397 153.22Z" stroke="#BCBCBC" strokeWidth="0.625" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
        <defs><clipPath id="rp-clip"><rect width="467" height="284" fill="white"/></clipPath></defs>
      </svg>
    </ViewWrapper>
  )
}

function MyTimeView({ breadcrumb }) {
  return (
    <ViewWrapper breadcrumb={breadcrumb}>
      <svg width="467" height="284" viewBox="0 0 467 284" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#mt-clip)"><GridBg/>
          <path d="M269.833 173.008C269.431 166.466 268.152 159.744 266.027 152.841C263.388 144.327 259.819 136.188 255.319 128.397C252.972 124.355 250.416 120.494 247.638 116.786C245.083 113.355 242.333 110.063 239.403 106.925C233.305 100.397 226.791 95.1189 219.861 91.1189C218.277 90.2162 216.722 89.3828 215.194 88.6606C210.611 86.4801 206.222 85.1189 202.028 84.5495C201.444 84.4801 200.889 84.4106 200.319 84.3689C195.93 84.0078 191.944 84.4384 188.389 85.6745H188.361C186.986 86.1606 185.667 86.7578 184.417 87.4662C179.903 90.0356 176.333 94.0634 173.708 99.5356C171.069 105.022 169.75 111.73 169.75 119.688C169.75 127.647 171.069 135.869 173.708 144.383C176.333 152.897 179.903 161.05 184.417 168.827C188.917 176.605 194.222 183.758 200.319 190.3C206.417 196.841 212.93 202.105 219.861 206.105C226.791 210.119 233.305 212.369 239.403 212.869C245.5 213.369 250.805 212.327 255.319 209.758C259.514 207.369 262.889 203.702 265.472 198.799C265.666 198.438 265.847 198.063 266.027 197.688C267.652 194.3 268.778 190.425 269.403 186.063C269.778 183.411 269.972 180.563 269.972 177.55C269.972 176.05 269.931 174.536 269.833 173.008ZM235.264 200.063C230.347 199.508 225.208 197.702 219.861 194.619C208.666 188.147 199.194 178.216 191.43 164.827C183.666 151.424 179.778 138.313 179.778 125.466C179.778 112.619 183.666 103.994 191.43 99.5634C193.528 98.3689 195.75 97.5773 198.111 97.1745C201.625 96.5773 205.416 96.8689 209.486 98.0495C212.764 98.9939 216.222 100.522 219.861 102.619V148.619L229.944 166.008L243.736 189.8L248.292 197.661C244.542 199.799 240.194 200.605 235.264 200.063Z" stroke="#BCBCBC" strokeWidth="0.694444" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M248.291 197.661C244.541 199.8 240.194 200.605 235.263 200.063C230.347 199.508 225.208 197.702 219.86 194.619C208.666 188.147 199.194 178.216 191.43 164.827C183.666 151.425 179.777 138.313 179.777 125.466C179.777 112.619 183.666 103.994 191.43 99.5635C193.527 98.369 195.75 97.5774 198.111 97.1746C201.625 96.5774 205.416 96.869 209.485 98.0496C208.194 101.869 207.555 106.383 207.555 111.577C207.555 124.425 211.444 137.536 219.208 150.938C222.472 156.577 226.041 161.605 229.944 166.008L243.736 189.8L248.291 197.661Z" stroke="#BCBCBC" strokeWidth="0.694444" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M297.75 163.66C297.75 171.605 296.43 178.327 293.805 183.799C291.166 189.272 287.597 193.299 283.097 195.869L255.319 209.758C259.514 207.369 262.889 203.702 265.472 198.799C265.666 198.438 265.847 198.063 266.027 197.688C267.652 194.299 268.778 190.424 269.403 186.063C269.778 183.41 269.972 180.563 269.972 177.549C269.972 176.049 269.931 174.536 269.833 173.008C269.431 166.466 268.152 159.744 266.027 152.841C263.389 144.327 259.819 136.188 255.319 128.397C252.972 124.355 250.416 120.494 247.639 116.785C245.083 113.355 242.333 110.063 239.403 106.924C233.305 100.397 226.791 95.1188 219.861 91.1188C218.277 90.216 216.722 89.3827 215.194 88.6605C210.611 86.4799 206.222 85.1188 202.028 84.5493C201.444 84.4799 200.889 84.4105 200.319 84.3688C195.93 84.0077 191.944 84.4382 188.389 85.6743L212.195 73.5772C216.695 71.0077 222 69.98 228.097 70.48C234.194 70.98 240.708 73.23 247.639 77.23C254.569 81.2299 261.083 86.5077 267.18 93.0355C273.278 99.5771 278.583 106.73 283.097 114.508C287.597 122.299 291.166 130.438 293.805 138.952C296.43 147.466 297.75 155.702 297.75 163.66Z" stroke="#BCBCBC" strokeWidth="0.694444" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
        <defs><clipPath id="mt-clip"><rect width="467" height="284" fill="white"/></clipPath></defs>
      </svg>
    </ViewWrapper>
  )
}

function LogTeamView({ breadcrumb }) {
  return (
    <ViewWrapper breadcrumb={breadcrumb}>
      <svg width="467" height="284" viewBox="0 0 467 284" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#lt-clip)"><GridBg/>
          <path d="M291.334 186.422C291.334 193.284 289.244 197.926 285.062 200.359L283.929 200.926L261.44 212.17C265.622 209.737 267.712 205.095 267.712 198.233C267.712 197.985 267.712 197.737 267.712 197.489C267.57 190.863 265.48 184.048 261.452 177.067C257.72 170.607 253.291 165.646 248.118 162.197C247.492 161.772 246.854 161.382 246.204 161.004C243.665 159.528 241.279 158.583 239.07 158.158C236.318 157.615 233.826 157.863 231.582 158.914L239.047 155.182L254.425 147.493C254.531 147.434 254.637 147.375 254.744 147.327V157.626C256.338 159.126 257.85 160.697 259.291 162.363C260.732 164.016 262.102 165.753 263.389 167.583L267.559 165.505L271.881 163.343L280.787 158.879C282.311 160.816 283.74 162.941 285.074 165.256C289.255 172.497 291.346 179.56 291.346 186.422H291.334Z" stroke="#BCBCBC" strokeWidth="0.590551" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M267.7 197.489C267.558 190.863 265.468 184.048 261.44 177.068C257.708 170.607 253.279 165.646 248.106 162.198C247.48 161.772 246.842 161.382 246.192 161.005C243.653 159.528 241.267 158.583 239.058 158.158C236.306 157.615 233.815 157.863 231.57 158.914L230.791 159.304C228.913 160.355 227.46 161.855 226.409 163.827C225.122 166.272 224.472 169.414 224.472 173.276C224.472 175.863 224.756 178.461 225.346 181.083C226.326 185.512 228.145 189.989 230.791 194.536C235.007 201.764 240.145 207.126 246.192 210.622C252.181 214.071 257.259 214.591 261.44 212.17C265.621 209.737 267.712 205.095 267.712 198.233C267.712 197.985 267.712 197.737 267.712 197.489H267.7ZM253.326 201.717L243.925 185.5V169.615L248.248 172.119V186.008L256.362 199.992L253.326 201.717Z" stroke="#BCBCBC" strokeWidth="0.590551" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M256.362 199.993L253.326 201.717L243.925 185.5V169.615L248.248 172.119V186.008L256.362 199.993Z" stroke="#BCBCBC" strokeWidth="0.590551" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M203.98 116.784L200.531 118.508L185.555 125.996V106.154L200.531 114.799L203.98 116.784Z" stroke="#BCBCBC" strokeWidth="0.590551" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M242.885 139.248L224.472 148.461L200.531 134.642L185.555 125.996L200.531 118.508L203.98 116.784L242.885 139.248Z" stroke="#BCBCBC" strokeWidth="0.590551" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M263.377 131.241V167.583C262.09 165.752 260.72 164.016 259.279 162.363C257.838 160.697 256.326 159.126 254.732 157.626V146.087L244.055 139.922L242.885 139.248L203.98 116.784L200.531 114.8L185.555 106.154V125.996L200.531 134.642L224.472 148.461C221.661 149.985 219.44 152.406 217.822 155.725C217.433 156.528 217.09 157.378 216.795 158.276C215.862 161.075 215.389 164.335 215.389 168.032C215.389 170.678 215.637 173.406 216.145 176.217C216.653 179.028 217.373 181.827 218.307 184.603L176.909 160.697V81.3153L200.531 94.9572L209.177 99.9413L263.377 131.241Z" stroke="#BCBCBC" strokeWidth="0.590551" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M287 121.142V155.772L280.775 158.879L271.87 163.343L267.547 165.505L263.378 167.583V131.241L268.964 128.855L287 121.142Z" stroke="#BCBCBC" strokeWidth="0.590551" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M287 119.43V121.142L268.964 128.855L263.377 131.241L209.177 99.9413L200.531 94.9572L176.909 81.3153L200.531 69.5043L287 119.43Z" stroke="#BCBCBC" strokeWidth="0.590551" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M244.055 139.922C243.051 141.056 242.188 142.39 241.444 143.914C239.944 146.997 239.129 150.753 239.035 155.182L231.57 158.914L230.791 159.304C228.913 160.355 227.46 161.855 226.409 163.827C225.122 166.272 224.472 169.414 224.472 173.276C224.472 175.863 224.756 178.461 225.346 181.083L218.306 184.603C217.373 181.827 216.653 179.028 216.145 176.217C215.637 173.406 215.389 170.678 215.389 168.032C215.389 164.335 215.862 161.075 216.795 158.276C217.09 157.379 217.433 156.528 217.822 155.725C219.44 152.406 221.661 149.985 224.472 148.461L242.885 139.249L244.055 139.922Z" stroke="#BCBCBC" strokeWidth="0.590551" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
        <defs><clipPath id="lt-clip"><rect width="467" height="284" fill="white"/></clipPath></defs>
      </svg>
    </ViewWrapper>
  )
}

function PlaceholderView({ title, breadcrumb }) {
  return (
    <div style={{ display:"flex", flex:1, flexDirection:"column" }}>
      <div style={{ padding:"20px 24px 16px" }}>
        <h2 style={{ fontSize:18, fontWeight:600, color:t.fg }}>{title}</h2>
        <p style={{ fontSize:13, color:t.mutedFg, marginTop:4 }}>
          {breadcrumb.length >= 2 ? `The ${breadcrumb[breadcrumb.length-1]} for ${breadcrumb[0]}` : "View details and manage settings for this section"}
        </p>
      </div>
      <div style={{ display:"flex", flex:1, alignItems:"center", justifyContent:"center" }}>
        <p style={{ fontSize:13, color:t.mutedFg }}>Content coming soon</p>
      </div>
    </div>
  )
}

function VersionsToggle({ version, onChange }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ position:"absolute", bottom:16, right:16 }}>
      <DropdownWrapper open={open} setOpen={setOpen}
        trigger={
          <HoverBtn onClick={() => setOpen(!open)}
            style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 14px", borderRadius:8, border:`1px solid ${t.border}`, background: open ? t.accent : t.bg, color:t.fg, cursor:"pointer", fontSize:13, fontWeight:500 }}>
            <Layers size={14} strokeWidth={1.5}/>Versions
          </HoverBtn>
        }>
        <div style={{ ...s.dropdown, bottom:"100%", top:"auto", marginBottom:8, width:200 }}>
          {[["multi","Multi office"],["single","Single office"]].map(([v,l]) => (
            <button key={v} onClick={() => { onChange(v); setOpen(false) }} style={s.dropdownItem(version===v)}>
              {l} {version===v && <Check size={12} strokeWidth={1.5}/>}
            </button>
          ))}
        </div>
      </DropdownWrapper>
    </div>
  )
}

export default function App() {
  const [version, setVersion] = useState("multi")
  const [activeItem, setActiveItem] = useState("Dashboard")
  const [breadcrumb, setBreadcrumb] = useState(["Global", "Dashboard"])
  const [roles, setRoles] = useState(INITIAL_ROLES)
  const [departments, setDepartments] = useState(INITIAL_DEPARTMENTS)
  const [people, setPeople] = useState(INITIAL_PEOPLE)
  const [contractors, setContractors] = useState(INITIAL_CONTRACTORS)
  const [projects, setProjects] = useState(INITIAL_PROJECTS)
  const [clients] = useState(INITIAL_CLIENTS_DATA)
  const [isDarkMode, setIsDarkMode] = useState(true)

  const deptPeopleCounts = {}
  people.forEach(p => { deptPeopleCounts[p.departmentId] = (deptPeopleCounts[p.departmentId] || 0) + 1 })

  // Update theme based on mode
  t = isDarkMode ? darkTheme : lightTheme
  s = getStyles(t)

  function renderMain() {
    if (activeItem === "Roles") return <RolesAndRates roles={roles} onRolesChange={setRoles}/>
    if (activeItem === "People") return <People roles={roles} departments={departments} onDepartmentsChange={setDepartments} people={people} onPeopleChange={setPeople} contractors={contractors} onContractorsChange={setContractors} deptPeopleCounts={deptPeopleCounts}/>
    if (activeItem === "Project tracker") return <ProjectTracker projects={projects} onProjectsChange={setProjects} people={people} clients={clients}/>
    if (activeItem === "Projects") return <ProjectsDataHub projects={projects} onProjectsChange={setProjects} people={people} clients={clients}/>
    if (activeItem === "Clients") return <Clients roles={roles}/>
    if (activeItem === "Business units") return <BusinessUnits roles={roles}/>
    if (activeItem === "Activity log") return <ActivityLog/>
    if (activeItem === "Dashboard") return <DashboardView breadcrumb={breadcrumb}/>
    if (activeItem === "Report") return <ReportView breadcrumb={breadcrumb}/>
    if (activeItem === "Schedule") return <ScheduleView breadcrumb={breadcrumb}/>
    if (activeItem === "Project plan") return <ProjectPlanView breadcrumb={breadcrumb}/>
    if (activeItem === "My time") return <MyTimeView breadcrumb={breadcrumb}/>
    if (activeItem === "Log team") return <LogTeamView breadcrumb={breadcrumb}/>
    return <PlaceholderView title={breadcrumb[breadcrumb.length-1]} breadcrumb={breadcrumb}/>
  }

  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden", background:t.bg, color:t.fg, fontFamily:"Inter, -apple-system, sans-serif" }}>
      <SidebarNav version={version} activeItem={activeItem} onActiveItemChange={setActiveItem} onBreadcrumbChange={setBreadcrumb} isDarkMode={isDarkMode} onThemeChange={setIsDarkMode}/>
      <main style={{ ...s.main, position:"relative" }}>
        <nav style={{ display:"flex", alignItems:"center", gap:4, borderBottom:`1px solid ${t.border}`, padding:"12px 24px", background:t.card, color:t.fg }}>
          {breadcrumb.map((seg, i) => (
            <span key={i} style={{ display:"flex", alignItems:"center", gap:4 }}>
              {i > 0 && <span style={{ fontSize:13, color:t.secondaryFg }}>/</span>}
              <span style={{ fontSize:13, color: i===breadcrumb.length-1 ? t.fg : t.secondaryFg, fontWeight: i===breadcrumb.length-1 ? 500 : 400 }}>{seg}</span>
            </span>
          ))}
        </nav>
        <div style={{ display:"flex", flex:1, overflow:"hidden" }}>
          {renderMain()}
        </div>
        <VersionsToggle version={version} onChange={setVersion}/>
      </main>
    </div>
  )
}
