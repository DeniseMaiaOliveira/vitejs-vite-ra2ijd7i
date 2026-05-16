import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── ICONS (inline SVG components) ─────────────────────────────────────────
const Icon = ({ d, size = 20, stroke = "currentColor", fill = "none", strokeWidth = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const icons = {
  paw: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z",
  home: ["M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z", "M9 22V12h6v10"],
  users: ["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2", "M23 21v-2a4 4 0 0 0-3-3.87", "M16 3.13a4 4 0 0 1 0 7.75", "M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"],
  heart: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
  calendar: ["M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z", "M16 2v4M8 2v4M3 10h18"],
  syringe: ["M18 2l4 4", "M17 7L7 17", "M9 9l-6 6 2 4 4-2 6-6", "M14 4l2 2"],
  dollar: ["M12 1v22", "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"],
  chart: ["M18 20V10", "M12 20V4", "M6 20v-6"],
  bell: ["M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9", "M13.73 21a2 2 0 0 1-3.46 0"],
  search: ["M11 19A8 8 0 1 0 11 3a8 8 0 0 0 0 16z", "M21 21l-4.35-4.35"],
  plus: ["M12 5v14", "M5 12h14"],
  edit: ["M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7", "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"],
  trash: ["M3 6h18", "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"],
  x: ["M18 6L6 18", "M6 6l12 12"],
  check: "M20 6L9 17l-5-5",
  chevronRight: "M9 18l6-6-6-6",
  chevronDown: "M6 9l6 6 6-6",
  menu: ["M3 12h18", "M3 6h18", "M3 18h18"],
  logout: ["M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", "M16 17l5-5-5-5", "M21 12H9"],
  settings: ["M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z", "M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"],
  phone: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 5.91 5.91l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z",
  mapPin: ["M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z", "M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"],
  whatsapp: "M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.36 5.08L2 22l5.08-1.34A9.93 9.93 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  activity: ["M22 12h-4l-3 9L9 3l-3 9H2"],
  eye: ["M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z", "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"],
  shield: ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"],
  crown: "M2 19h20M5 19V8l7-5 7 5v11",
  building: ["M3 21h18", "M3 7l9-4 9 4", "M3 7v14", "M21 7v14", "M9 21v-6h6v6"],
  arrowUp: ["M12 19V5", "M5 12l7-7 7 7"],
  arrowDown: ["M12 5v14", "M19 12l-7 7-7-7"],
  info: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z", "M12 8v4", "M12 16h.01"],
  filter: ["M22 3H2l8 9.46V19l4 2v-8.54L22 3z"],
  clock: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z", "M12 6v6l4 2"],
};

// ─── DATA ──────────────────────────────────────────────────────────────────
const mockClients = [
  { id: 1, name: "Ana Paula Mendes", phone: "(11) 99876-5432", email: "ana@email.com", address: "Rua das Flores, 123 - SP", pets: 2, since: "2022-03-15", status: "active" },
  { id: 2, name: "Carlos Eduardo Lima", phone: "(11) 98765-4321", email: "carlos@email.com", address: "Av. Paulista, 456 - SP", pets: 1, since: "2023-01-10", status: "active" },
  { id: 3, name: "Fernanda Costa", phone: "(11) 97654-3210", email: "fernanda@email.com", address: "Rua Augusta, 789 - SP", pets: 3, since: "2021-11-22", status: "active" },
  { id: 4, name: "Roberto Almeida", phone: "(11) 96543-2109", email: "roberto@email.com", address: "Al. Santos, 321 - SP", pets: 1, since: "2023-05-18", status: "inactive" },
  { id: 5, name: "Juliana Rodrigues", phone: "(11) 95432-1098", email: "juliana@email.com", address: "Rua Haddock Lobo, 654 - SP", pets: 2, since: "2022-08-30", status: "active" },
  { id: 6, name: "Marcos Vieira", phone: "(11) 94321-0987", email: "marcos@email.com", address: "Rua Oscar Freire, 987 - SP", pets: 1, since: "2023-09-05", status: "active" },
];

const mockPets = [
  { id: 1, name: "Mel", species: "Cão", breed: "Golden Retriever", weight: 28.5, age: 4, color: "#F59E0B", clientId: 1, clientName: "Ana Paula Mendes", nextVaccine: "2026-06-15", status: "healthy", avatar: "🐕" },
  { id: 2, name: "Bolinha", species: "Gato", breed: "Persa", weight: 4.2, age: 3, color: "#8B5CF6", clientId: 1, clientName: "Ana Paula Mendes", nextVaccine: "2026-07-01", status: "healthy", avatar: "🐈" },
  { id: 3, name: "Thor", species: "Cão", breed: "Labrador", weight: 32.0, age: 6, color: "#3B82F6", clientId: 2, clientName: "Carlos Eduardo Lima", nextVaccine: "2026-05-20", status: "attention", avatar: "🐕" },
  { id: 4, name: "Nina", species: "Gato", breed: "Siamês", weight: 3.8, age: 2, color: "#EC4899", clientId: 3, clientName: "Fernanda Costa", nextVaccine: "2026-08-10", status: "healthy", avatar: "🐈" },
  { id: 5, name: "Max", species: "Cão", breed: "Pastor Alemão", weight: 35.0, age: 5, color: "#10B981", clientId: 3, clientName: "Fernanda Costa", nextVaccine: "2026-06-28", status: "healthy", avatar: "🐕" },
  { id: 6, name: "Pipoca", species: "Coelho", breed: "Mini Rex", weight: 1.5, age: 1, color: "#F97316", clientId: 5, clientName: "Juliana Rodrigues", nextVaccine: "2026-09-15", status: "healthy", avatar: "🐇" },
];

const mockAppointments = [
  { id: 1, petName: "Mel", clientName: "Ana Paula Mendes", type: "Consulta Geral", vet: "Dr. Bruno Martins", date: "2026-05-15", time: "09:00", status: "confirmed", duration: 30 },
  { id: 2, petName: "Thor", clientName: "Carlos Eduardo Lima", type: "Vacinação", vet: "Dra. Carla Souza", date: "2026-05-15", time: "10:00", status: "completed", duration: 20 },
  { id: 3, petName: "Nina", clientName: "Fernanda Costa", type: "Exame de Sangue", vet: "Dr. Bruno Martins", date: "2026-05-15", time: "11:30", status: "confirmed", duration: 45 },
  { id: 4, petName: "Max", clientName: "Fernanda Costa", type: "Retorno", vet: "Dra. Carla Souza", date: "2026-05-15", time: "14:00", status: "pending", duration: 30 },
  { id: 5, petName: "Bolinha", clientName: "Ana Paula Mendes", type: "Banho e Tosa", vet: "Equipe", date: "2026-05-16", time: "09:30", status: "confirmed", duration: 60 },
  { id: 6, petName: "Pipoca", clientName: "Juliana Rodrigues", type: "Consulta Geral", vet: "Dr. Bruno Martins", date: "2026-05-16", time: "11:00", status: "pending", duration: 30 },
  { id: 7, petName: "Thor", clientName: "Carlos Eduardo Lima", type: "Cirurgia", vet: "Dr. Bruno Martins", date: "2026-05-17", time: "08:00", status: "confirmed", duration: 120 },
];

const mockFinancial = [
  { id: 1, description: "Consulta - Mel", type: "income", amount: 180, date: "2026-05-15", category: "Consulta", method: "PIX" },
  { id: 2, description: "Vacinação - Thor", type: "income", amount: 95, date: "2026-05-15", category: "Vacina", method: "Cartão" },
  { id: 3, description: "Medicamentos", type: "expense", amount: 320, date: "2026-05-14", category: "Estoque", method: "Boleto" },
  { id: 4, description: "Exame - Nina", type: "income", amount: 250, date: "2026-05-14", category: "Exame", method: "PIX" },
  { id: 5, description: "Energia elétrica", type: "expense", amount: 580, date: "2026-05-13", category: "Fixo", method: "Débito" },
  { id: 6, description: "Banho e Tosa - Bolinha", type: "income", amount: 120, date: "2026-05-13", category: "Estética", method: "Dinheiro" },
  { id: 7, description: "Consulta - Pipoca", type: "income", amount: 160, date: "2026-05-12", category: "Consulta", method: "PIX" },
  { id: 8, description: "Salários", type: "expense", amount: 8500, date: "2026-05-10", category: "RH", method: "Transferência" },
];

const chartData = [
  { day: "09/05", consults: 8 }, { day: "10/05", consults: 12 }, { day: "11/05", consults: 7 },
  { day: "12/05", consults: 15 }, { day: "13/05", consults: 10 }, { day: "14/05", consults: 14 }, { day: "15/05", consults: 11 },
];

// ─── THEME ─────────────────────────────────────────────────────────────────
const theme = {
  bg: "#F8F7F4",
  surface: "#FFFFFF",
  surfaceAlt: "#F3F1EE",
  border: "#E8E4DE",
  borderLight: "#F0EDE8",
  text: "#1C1A17",
  textSecondary: "#6B6560",
  textMuted: "#9E9890",
  primary: "#2D6A4F",
  primaryLight: "#E8F5F0",
  primaryMid: "#52B788",
  accent: "#D4A853",
  accentLight: "#FDF6E7",
  danger: "#DC3545",
  dangerLight: "#FEE8EA",
  warning: "#F59E0B",
  warningLight: "#FEF3CD",
  info: "#3B82F6",
  infoLight: "#EFF6FF",
  success: "#10B981",
  successLight: "#ECFDF5",
};

// ─── UTILITY COMPONENTS ────────────────────────────────────────────────────
const Badge = ({ children, variant = "default", size = "sm" }) => {
  const variants = {
    default: { bg: theme.surfaceAlt, color: theme.textSecondary, border: theme.border },
    success: { bg: theme.successLight, color: "#065F46", border: "#A7F3D0" },
    warning: { bg: theme.warningLight, color: "#92400E", border: "#FDE68A" },
    danger: { bg: theme.dangerLight, color: "#9B1C1C", border: "#FECACA" },
    info: { bg: theme.infoLight, color: "#1D4ED8", border: "#BFDBFE" },
    primary: { bg: theme.primaryLight, color: theme.primary, border: "#A7D7C5" },
    accent: { bg: theme.accentLight, color: "#92400E", border: "#FDE68A" },
  };
  const v = variants[variant];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: size === "sm" ? "2px 8px" : "4px 12px",
      borderRadius: 20, fontSize: size === "sm" ? 11 : 12, fontWeight: 600,
      background: v.bg, color: v.color, border: `1px solid ${v.border}`, letterSpacing: "0.02em"
    }}>
      {children}
    </span>
  );
};

const Card = ({ children, style = {}, onClick, hover = false }) => (
  <motion.div
    onClick={onClick}
    whileHover={hover ? { y: -2, boxShadow: "0 8px 32px rgba(45,106,79,0.12)" } : {}}
    style={{
      background: theme.surface, borderRadius: 16, border: `1px solid ${theme.border}`,
      padding: 20, cursor: onClick || hover ? "pointer" : "default",
      boxShadow: "0 1px 4px rgba(0,0,0,0.04)", transition: "box-shadow 0.2s ease", ...style
    }}>
    {children}
  </motion.div>
);

const Button = ({ children, variant = "primary", size = "md", onClick, icon, disabled = false, style = {} }) => {
  const variants = {
    primary: { bg: theme.primary, color: "#fff", border: "transparent", hover: "#1E5038" },
    secondary: { bg: theme.surface, color: theme.text, border: theme.border, hover: theme.surfaceAlt },
    ghost: { bg: "transparent", color: theme.textSecondary, border: "transparent", hover: theme.surfaceAlt },
    danger: { bg: theme.dangerLight, color: theme.danger, border: "#FECACA", hover: "#FEE2E2" },
    accent: { bg: theme.accent, color: "#fff", border: "transparent", hover: "#C09040" },
  };
  const v = variants[variant];
  const sizes = { sm: { padding: "6px 12px", fontSize: 13 }, md: { padding: "9px 18px", fontSize: 14 }, lg: { padding: "12px 24px", fontSize: 15 } };
  const s = sizes[size];
  return (
    <motion.button
      whileHover={{ opacity: 0.9 }}
      whileTap={{ scale: 0.97 }}
      disabled={disabled}
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: s.padding, fontSize: s.fontSize, fontWeight: 600,
        background: v.bg, color: v.color, border: `1px solid ${v.border}`,
        borderRadius: 10, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1,
        fontFamily: "inherit", letterSpacing: "0.01em", ...style
      }}>
      {icon && <Icon d={icons[icon]} size={15} />}
      {children}
    </motion.button>
  );
};

const Input = ({ label, value, onChange, placeholder, type = "text", icon, style = {} }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
    {label && <label style={{ fontSize: 13, fontWeight: 600, color: theme.textSecondary }}>{label}</label>}
    <div style={{ position: "relative" }}>
      {icon && <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: theme.textMuted, display: "flex" }}>
        <Icon d={icons[icon]} size={16} />
      </span>}
      <input
        type={type} value={value} onChange={onChange} placeholder={placeholder}
        style={{
          width: "100%", padding: icon ? "9px 12px 9px 38px" : "9px 12px",
          border: `1px solid ${theme.border}`, borderRadius: 10, fontSize: 14,
          background: theme.surface, color: theme.text, fontFamily: "inherit",
          outline: "none", boxSizing: "border-box",
          transition: "border-color 0.15s ease",
        }}
        onFocus={e => e.target.style.borderColor = theme.primary}
        onBlur={e => e.target.style.borderColor = theme.border}
      />
    </div>
  </div>
);

const Avatar = ({ name, size = 36, color = theme.primary, emoji }) => {
  if (emoji) return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: theme.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.45, flexShrink: 0 }}>
      {emoji}
    </div>
  );
  const initials = name?.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase() || "?";
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.35, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
      {initials}
    </div>
  );
};

const Stat = ({ label, value, icon, trend, color = theme.primary, bg }) => (
  <Card style={{ padding: 20 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <p style={{ fontSize: 12, color: theme.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>{label}</p>
        <p style={{ fontSize: 28, fontWeight: 800, color: theme.text, lineHeight: 1 }}>{value}</p>
        {trend && <p style={{ fontSize: 12, color: trend > 0 ? theme.success : theme.danger, marginTop: 6, fontWeight: 600 }}>
          {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}% vs. mês anterior
        </p>}
      </div>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: bg || theme.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", color }}>
        <Icon d={icons[icon]} size={22} />
      </div>
    </div>
  </Card>
);

// ─── MODAL ─────────────────────────────────────────────────────────────────
const Modal = ({ title, onClose, children, width = 500 }) => (
  <AnimatePresence>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, background: "rgba(28,26,23,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
      onClick={onClose}>
      <motion.div initial={{ scale: 0.93, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.93, y: 20 }}
        onClick={e => e.stopPropagation()}
        style={{ background: theme.surface, borderRadius: 20, width: "100%", maxWidth: width, maxHeight: "90vh", overflow: "auto", boxShadow: "0 24px 80px rgba(0,0,0,0.18)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: `1px solid ${theme.border}` }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: theme.text }}>{title}</h3>
          <button onClick={onClose} style={{ background: theme.surfaceAlt, border: "none", borderRadius: 8, padding: 6, cursor: "pointer", display: "flex", color: theme.textSecondary }}>
            <Icon d={icons.x} size={18} />
          </button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

// ─── MINI CHART ────────────────────────────────────────────────────────────
const MiniChart = ({ data }) => {
  const max = Math.max(...data.map(d => d.consults));
  const h = 80;
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: h + 30 }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <motion.div
            initial={{ height: 0 }} animate={{ height: (d.consults / max) * h }}
            transition={{ delay: i * 0.05, duration: 0.4, ease: "easeOut" }}
            style={{ width: "100%", background: i === data.length - 1 ? theme.primary : theme.primaryLight, borderRadius: "4px 4px 0 0", minHeight: 4 }}
          />
          <span style={{ fontSize: 10, color: theme.textMuted, whiteSpace: "nowrap" }}>{d.day.split("/")[0]}</span>
        </div>
      ))}
    </div>
  );
};

// ─── SIDEBAR ───────────────────────────────────────────────────────────────
const navItems = [
  { id: "dashboard", label: "Dashboard", icon: "home" },
  { id: "clients", label: "Clientes", icon: "users" },
  { id: "pets", label: "Pets", icon: "heart" },
  { id: "agenda", label: "Agenda", icon: "calendar" },
  { id: "vaccines", label: "Vacinas", icon: "syringe" },
  { id: "financial", label: "Financeiro", icon: "dollar" },
];

const Sidebar = ({ active, setActive, collapsed, setCollapsed }) => (
  <motion.aside
    animate={{ width: collapsed ? 68 : 240 }}
    transition={{ duration: 0.25, ease: "easeInOut" }}
    style={{ background: theme.surface, borderRight: `1px solid ${theme.border}`, height: "100vh", display: "flex", flexDirection: "column", position: "fixed", left: 0, top: 0, zIndex: 100, overflow: "hidden" }}>
    {/* Logo */}
    <div style={{ padding: collapsed ? "20px 0" : "20px 20px", display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${theme.border}`, justifyContent: collapsed ? "center" : "flex-start" }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryMid})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <span style={{ fontSize: 18 }}>🐾</span>
      </div>
      <AnimatePresence>
        {!collapsed && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
            <p style={{ fontSize: 17, fontWeight: 800, color: theme.text, letterSpacing: "-0.02em" }}>VetCare</p>
            <p style={{ fontSize: 10, color: theme.primary, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Clínica Premium</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>

    {/* Nav */}
    <nav style={{ flex: 1, padding: "12px 8px", display: "flex", flexDirection: "column", gap: 2 }}>
      {navItems.map(item => (
        <motion.button key={item.id} onClick={() => setActive(item.id)} whileHover={{ x: collapsed ? 0 : 2 }} whileTap={{ scale: 0.97 }}
          style={{
            display: "flex", alignItems: "center", gap: 12, padding: collapsed ? "11px 0" : "11px 14px",
            borderRadius: 10, border: "none", cursor: "pointer", justifyContent: collapsed ? "center" : "flex-start", width: "100%",
            background: active === item.id ? theme.primaryLight : "transparent",
            color: active === item.id ? theme.primary : theme.textSecondary,
            fontFamily: "inherit", fontSize: 14, fontWeight: active === item.id ? 700 : 500,
            transition: "all 0.15s ease",
          }}>
          <Icon d={icons[item.icon]} size={19} />
          <AnimatePresence>
            {!collapsed && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{item.label}</motion.span>}
          </AnimatePresence>
          {active === item.id && !collapsed && (
            <motion.div layoutId="activeIndicator" style={{ width: 4, height: 4, borderRadius: "50%", background: theme.primary, marginLeft: "auto" }} />
          )}
        </motion.button>
      ))}
    </nav>

    {/* Bottom */}
    <div style={{ padding: "12px 8px", borderTop: `1px solid ${theme.border}` }}>
      <button onClick={() => setCollapsed(!collapsed)}
        style={{ display: "flex", alignItems: "center", gap: 10, padding: collapsed ? "10px 0" : "10px 14px", borderRadius: 10, border: "none", cursor: "pointer", width: "100%", background: "transparent", color: theme.textMuted, fontFamily: "inherit", justifyContent: collapsed ? "center" : "flex-start" }}>
        <Icon d={icons.menu} size={18} />
        {!collapsed && <span style={{ fontSize: 13 }}>Minimizar</span>}
      </button>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: collapsed ? "10px 0" : "10px 14px", marginTop: 4, justifyContent: collapsed ? "center" : "flex-start" }}>
        <Avatar name="Dr. Bruno Martins" size={30} color={theme.primary} />
        {!collapsed && (
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: theme.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Dr. Bruno Martins</p>
            <p style={{ fontSize: 11, color: theme.textMuted }}>Veterinário</p>
          </div>
        )}
      </div>
    </div>
  </motion.aside>
);

// ─── TOPBAR ────────────────────────────────────────────────────────────────
const TopBar = ({ title, subtitle, action }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: theme.text, letterSpacing: "-0.03em" }}>{title}</h1>
      {subtitle && <p style={{ fontSize: 14, color: theme.textSecondary, marginTop: 2 }}>{subtitle}</p>}
    </div>
    {action}
  </div>
);

// ─── STATUS BADGE ──────────────────────────────────────────────────────────
const statusBadge = (status) => {
  const map = { confirmed: ["success", "Confirmado"], completed: ["primary", "Concluído"], pending: ["warning", "Pendente"], cancelled: ["danger", "Cancelado"], active: ["success", "Ativo"], inactive: ["default", "Inativo"], healthy: ["success", "Saudável"], attention: ["warning", "Atenção"] };
  const [variant, label] = map[status] || ["default", status];
  return <Badge variant={variant}>{label}</Badge>;
};

// ─── PAGES ─────────────────────────────────────────────────────────────────

// DASHBOARD
const Dashboard = () => {
  const todayAppts = mockAppointments.filter(a => a.date === "2026-05-15");
  const income = mockFinancial.filter(f => f.type === "income").reduce((s, f) => s + f.amount, 0);
  const expense = mockFinancial.filter(f => f.type === "expense").reduce((s, f) => s + f.amount, 0);

  return (
    <div>
      <TopBar title="Dashboard" subtitle={`Sexta-feira, 15 de Maio de 2026`} />

      {/* Greeting Banner */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        style={{ background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryMid} 100%)`, borderRadius: 20, padding: "24px 28px", marginBottom: 24, color: "#fff", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -20, top: -20, fontSize: 120, opacity: 0.08 }}>🐾</div>
        <p style={{ fontSize: 13, opacity: 0.8, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>Bom dia!</p>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginTop: 4, letterSpacing: "-0.02em" }}>Dr. Bruno Martins 👋</h2>
        <p style={{ fontSize: 14, opacity: 0.85, marginTop: 6 }}>Você tem <strong>{todayAppts.length} consultas</strong> agendadas para hoje.</p>
      </motion.div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Clientes", value: mockClients.length, icon: "users", trend: 12, bg: "#EFF6FF", color: theme.info },
          { label: "Pets", value: mockPets.length, icon: "heart", trend: 8, bg: "#FFF1F2", color: "#E11D48" },
          { label: "Consultas Hoje", value: todayAppts.length, icon: "calendar", bg: theme.primaryLight, color: theme.primary },
          { label: "Receita Mensal", value: `R$ ${income.toLocaleString("pt-BR")}`, icon: "dollar", trend: 15, bg: theme.accentLight, color: "#B45309" },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Stat {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        <Card>
          <p style={{ fontSize: 13, fontWeight: 700, color: theme.textSecondary, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 16 }}>Consultas — últimos 7 dias</p>
          <MiniChart data={chartData} />
        </Card>
        <Card>
          <p style={{ fontSize: 13, fontWeight: 700, color: theme.textSecondary, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 16 }}>Resumo Financeiro</p>
          {[["Receitas", income, theme.success], ["Despesas", expense, theme.danger], ["Saldo", income - expense, theme.primary]].map(([label, val, color]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${theme.borderLight}` }}>
              <span style={{ fontSize: 14, color: theme.textSecondary }}>{label}</span>
              <span style={{ fontSize: 15, fontWeight: 700, color }}>{val >= 0 ? "" : "-"}R$ {Math.abs(val).toLocaleString("pt-BR")}</span>
            </div>
          ))}
        </Card>
      </div>

      {/* Today's appointments */}
      <Card>
        <p style={{ fontSize: 13, fontWeight: 700, color: theme.textSecondary, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 16 }}>Agenda de Hoje</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {todayAppts.map((appt, i) => (
            <motion.div key={appt.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
              style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 14px", background: theme.surfaceAlt, borderRadius: 12 }}>
              <div style={{ width: 48, textAlign: "center" }}>
                <p style={{ fontSize: 15, fontWeight: 800, color: theme.primary }}>{appt.time}</p>
              </div>
              <div style={{ width: 1, height: 40, background: theme.border }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: theme.text }}>{appt.petName} <span style={{ fontWeight: 400, color: theme.textSecondary }}>• {appt.clientName}</span></p>
                <p style={{ fontSize: 13, color: theme.textMuted }}>{appt.type} — {appt.vet}</p>
              </div>
              {statusBadge(appt.status)}
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
};

// CLIENTS
const Clients = () => {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "" });

  const filtered = mockClients.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <TopBar title="Clientes" subtitle={`${mockClients.length} clientes cadastrados`}
        action={<Button icon="plus" onClick={() => { setSelected(null); setForm({ name: "", phone: "", email: "", address: "" }); setShowModal(true); }}>Novo Cliente</Button>} />

      <Card style={{ marginBottom: 16 }}>
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nome ou email..." icon="search" />
      </Card>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map((client, i) => (
          <motion.div key={client.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card hover style={{ padding: "16px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <Avatar name={client.name} size={44} color={`hsl(${client.id * 47}, 55%, 45%)`} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <p style={{ fontSize: 15, fontWeight: 700, color: theme.text }}>{client.name}</p>
                    {statusBadge(client.status)}
                  </div>
                  <div style={{ display: "flex", gap: 16, marginTop: 4, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13, color: theme.textMuted, display: "flex", alignItems: "center", gap: 4 }}>
                      <Icon d={icons.phone} size={13} />{client.phone}
                    </span>
                    <span style={{ fontSize: 13, color: theme.textMuted }}>{client.email}</span>
                    <span style={{ fontSize: 13, color: theme.textMuted }}>🐾 {client.pets} pet(s)</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <Button variant="ghost" size="sm" icon="whatsapp" onClick={() => window.open(`https://wa.me/${client.phone.replace(/\D/g, "")}`)}>WhatsApp</Button>
                  <Button variant="secondary" size="sm" icon="edit" onClick={() => { setSelected(client); setForm({ name: client.name, phone: client.phone, email: client.email, address: client.address }); setShowModal(true); }} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {showModal && (
        <Modal title={selected ? "Editar Cliente" : "Novo Cliente"} onClose={() => setShowModal(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Input label="Nome completo" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ana Paula Mendes" />
            <Input label="Telefone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="(11) 99999-9999" />
            <Input label="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@exemplo.com" type="email" />
            <Input label="Endereço" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Rua, número - Cidade" />
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
              <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
              <Button onClick={() => setShowModal(false)}>Salvar Cliente</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// PETS
const Pets = () => {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [filterSpecies, setFilterSpecies] = useState("all");

  const filtered = mockPets.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.clientName.toLowerCase().includes(search.toLowerCase());
    const matchSpecies = filterSpecies === "all" || p.species === filterSpecies;
    return matchSearch && matchSpecies;
  });

  const speciesColors = { "Cão": "#3B82F6", "Gato": "#8B5CF6", "Coelho": "#F97316" };

  return (
    <div>
      <TopBar title="Pets" subtitle={`${mockPets.length} animais cadastrados`}
        action={<Button icon="plus" onClick={() => setShowModal(true)}>Novo Pet</Button>} />

      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nome ou tutor..." icon="search" style={{ flex: 1, minWidth: 200 }} />
          <div style={{ display: "flex", gap: 8 }}>
            {["all", "Cão", "Gato", "Coelho"].map(s => (
              <button key={s} onClick={() => setFilterSpecies(s)}
                style={{ padding: "7px 14px", borderRadius: 8, border: `1px solid ${filterSpecies === s ? theme.primary : theme.border}`, background: filterSpecies === s ? theme.primaryLight : "transparent", color: filterSpecies === s ? theme.primary : theme.textSecondary, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit" }}>
                {s === "all" ? "Todos" : s}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
        {filtered.map((pet, i) => (
          <motion.div key={pet.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }}>
            <Card hover style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ height: 6, background: speciesColors[pet.species] || theme.primary }} />
              <div style={{ padding: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: theme.surfaceAlt, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>
                    {pet.avatar}
                  </div>
                  <div>
                    <p style={{ fontSize: 16, fontWeight: 800, color: theme.text }}>{pet.name}</p>
                    <p style={{ fontSize: 13, color: theme.textSecondary }}>{pet.breed} • {pet.species}</p>
                  </div>
                  <div style={{ marginLeft: "auto" }}>{statusBadge(pet.status)}</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
                  {[["Idade", `${pet.age} anos`], ["Peso", `${pet.weight} kg`]].map(([label, val]) => (
                    <div key={label} style={{ background: theme.surfaceAlt, borderRadius: 10, padding: "8px 12px" }}>
                      <p style={{ fontSize: 11, color: theme.textMuted, fontWeight: 600 }}>{label}</p>
                      <p style={{ fontSize: 14, fontWeight: 700, color: theme.text }}>{val}</p>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <p style={{ fontSize: 11, color: theme.textMuted }}>Tutor</p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>{pet.clientName.split(" ").slice(0, 2).join(" ")}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: 11, color: theme.textMuted }}>Próx. vacina</p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: theme.primary }}>{new Date(pet.nextVaccine).toLocaleDateString("pt-BR")}</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {showModal && (
        <Modal title="Novo Pet" onClose={() => setShowModal(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Input label="Nome do pet" placeholder="Mel, Thor, Nina..." />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Input label="Espécie" placeholder="Cão, Gato..." />
              <Input label="Raça" placeholder="Golden Retriever..." />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Input label="Peso (kg)" placeholder="28.5" type="number" />
              <Input label="Idade" placeholder="4" type="number" />
            </div>
            <Input label="Tutor responsável" placeholder="Buscar cliente..." icon="search" />
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
              <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
              <Button onClick={() => setShowModal(false)}>Cadastrar Pet</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// AGENDA
const Agenda = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState("2026-05-15");

  const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const days = [
    { date: "2026-05-12", label: "12", day: "Seg" },
    { date: "2026-05-13", label: "13", day: "Ter" },
    { date: "2026-05-14", label: "14", day: "Qua" },
    { date: "2026-05-15", label: "15", day: "Qui" },
    { date: "2026-05-16", label: "16", day: "Sex" },
    { date: "2026-05-17", label: "17", day: "Sáb" },
    { date: "2026-05-18", label: "18", day: "Dom" },
  ];

  const dayAppts = mockAppointments.filter(a => a.date === selectedDay);

  const typeColors = { "Consulta Geral": "#3B82F6", "Vacinação": "#10B981", "Exame de Sangue": "#8B5CF6", "Retorno": "#F59E0B", "Banho e Tosa": "#EC4899", "Cirurgia": "#DC3545" };

  return (
    <div>
      <TopBar title="Agenda" subtitle="Maio 2026"
        action={<Button icon="plus" onClick={() => setShowModal(true)}>Novo Agendamento</Button>} />

      {/* Week calendar */}
      <Card style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 8, justifyContent: "space-between" }}>
          {days.map(d => {
            const hasAppts = mockAppointments.filter(a => a.date === d.date).length;
            const isSelected = d.date === selectedDay;
            return (
              <motion.button key={d.date} onClick={() => setSelectedDay(d.date)}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                style={{ flex: 1, padding: "12px 4px", borderRadius: 12, border: `2px solid ${isSelected ? theme.primary : "transparent"}`, background: isSelected ? theme.primary : theme.surfaceAlt, cursor: "pointer", textAlign: "center", fontFamily: "inherit" }}>
                <p style={{ fontSize: 11, color: isSelected ? "rgba(255,255,255,0.8)" : theme.textMuted, fontWeight: 600, marginBottom: 4 }}>{d.day}</p>
                <p style={{ fontSize: 18, fontWeight: 800, color: isSelected ? "#fff" : theme.text }}>{d.label}</p>
                {hasAppts > 0 && (
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: isSelected ? "rgba(255,255,255,0.8)" : theme.primary, margin: "4px auto 0" }} />
                )}
              </motion.button>
            );
          })}
        </div>
      </Card>

      {/* Appointments */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {dayAppts.length === 0 ? (
          <Card style={{ textAlign: "center", padding: 48 }}>
            <p style={{ fontSize: 40, marginBottom: 12 }}>📅</p>
            <p style={{ fontSize: 16, fontWeight: 700, color: theme.text }}>Nenhum agendamento</p>
            <p style={{ fontSize: 14, color: theme.textMuted, marginTop: 4 }}>Não há consultas para este dia</p>
          </Card>
        ) : dayAppts.map((appt, i) => (
          <motion.div key={appt.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <Card style={{ padding: "16px 20px" }}>
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ width: 4, borderRadius: 4, background: typeColors[appt.type] || theme.primary, alignSelf: "stretch", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                    <div>
                      <p style={{ fontSize: 15, fontWeight: 800, color: theme.text }}>{appt.petName}</p>
                      <p style={{ fontSize: 13, color: theme.textSecondary }}>{appt.clientName}</p>
                    </div>
                    {statusBadge(appt.status)}
                  </div>
                  <div style={{ display: "flex", gap: 16, marginTop: 10, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13, color: theme.textMuted, display: "flex", alignItems: "center", gap: 4 }}>
                      <Icon d={icons.clock} size={13} />{appt.time} • {appt.duration}min
                    </span>
                    <span style={{ fontSize: 13, color: typeColors[appt.type] || theme.primary, fontWeight: 600 }}>{appt.type}</span>
                    <span style={{ fontSize: 13, color: theme.textMuted }}>{appt.vet}</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {showModal && (
        <Modal title="Novo Agendamento" onClose={() => setShowModal(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Input label="Pet" placeholder="Buscar pet..." icon="search" />
            <Input label="Tipo de consulta" placeholder="Consulta Geral, Vacinação..." />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Input label="Data" type="date" />
              <Input label="Horário" type="time" />
            </div>
            <Input label="Veterinário" placeholder="Dr. Bruno Martins" />
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
              <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
              <Button onClick={() => setShowModal(false)}>Agendar</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// VACCINES
const Vaccines = () => {
  const sorted = [...mockPets].sort((a, b) => new Date(a.nextVaccine) - new Date(b.nextVaccine));
  const today = new Date("2026-05-15");

  return (
    <div>
      <TopBar title="Controle Vacinal" subtitle="Monitoramento de vacinas e próximas doses" />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Vacinas em dia", value: mockPets.filter(p => new Date(p.nextVaccine) > today).length, icon: "check", color: theme.success, bg: theme.successLight },
          { label: "Atenção necessária", value: mockPets.filter(p => new Date(p.nextVaccine) <= today).length, icon: "bell", color: theme.warning, bg: theme.warningLight },
          { label: "Total de Pets", value: mockPets.length, icon: "heart", color: theme.primary, bg: theme.primaryLight },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: stat.bg, display: "flex", alignItems: "center", justifyContent: "center", color: stat.color }}>
                  <Icon d={icons[stat.icon]} size={22} />
                </div>
                <div>
                  <p style={{ fontSize: 26, fontWeight: 800, color: theme.text }}>{stat.value}</p>
                  <p style={{ fontSize: 12, color: theme.textMuted }}>{stat.label}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <p style={{ fontSize: 13, fontWeight: 700, color: theme.textSecondary, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 16 }}>Calendário Vacinal — Por Ordem de Urgência</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {sorted.map((pet, i) => {
            const vaccDate = new Date(pet.nextVaccine);
            const diff = Math.ceil((vaccDate - today) / (1000 * 60 * 60 * 24));
            const isUrgent = diff <= 7;
            const isPast = diff < 0;

            return (
              <motion.div key={pet.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 14px", borderRadius: 12, background: isPast ? theme.dangerLight : isUrgent ? theme.warningLight : theme.surfaceAlt }}>
                <div style={{ fontSize: 24 }}>{pet.avatar}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: theme.text }}>{pet.name} <span style={{ fontWeight: 400, color: theme.textSecondary }}>• {pet.clientName.split(" ")[0]}</span></p>
                  <p style={{ fontSize: 13, color: theme.textMuted }}>{pet.breed} • {pet.species}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: isPast ? theme.danger : isUrgent ? "#92400E" : theme.text }}>{vaccDate.toLocaleDateString("pt-BR")}</p>
                  <p style={{ fontSize: 12, color: isPast ? theme.danger : isUrgent ? "#B45309" : theme.textMuted }}>
                    {isPast ? `${Math.abs(diff)} dias atrás` : diff === 0 ? "Hoje!" : `em ${diff} dias`}
                  </p>
                </div>
                <Badge variant={isPast ? "danger" : isUrgent ? "warning" : "success"}>
                  {isPast ? "Atrasada" : isUrgent ? "Urgente" : "Ok"}
                </Badge>
              </motion.div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

// FINANCIAL
const Financial = () => {
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("all");

  const filtered = mockFinancial.filter(f => filter === "all" || f.type === filter);
  const income = mockFinancial.filter(f => f.type === "income").reduce((s, f) => s + f.amount, 0);
  const expense = mockFinancial.filter(f => f.type === "expense").reduce((s, f) => s + f.amount, 0);

  return (
    <div>
      <TopBar title="Financeiro" subtitle="Gestão de receitas e despesas"
        action={<Button icon="plus" onClick={() => setShowModal(true)}>Nova Transação</Button>} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Receitas", value: income, color: theme.success, icon: "arrowUp", bg: theme.successLight },
          { label: "Despesas", value: expense, color: theme.danger, icon: "arrowDown", bg: theme.dangerLight },
          { label: "Saldo", value: income - expense, color: theme.primary, icon: "dollar", bg: theme.primaryLight },
        ].map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: item.bg, display: "flex", alignItems: "center", justifyContent: "center", color: item.color }}>
                  <Icon d={icons[item.icon]} size={20} />
                </div>
                <div>
                  <p style={{ fontSize: 12, color: theme.textMuted, fontWeight: 600 }}>{item.label}</p>
                  <p style={{ fontSize: 20, fontWeight: 800, color: item.color }}>R$ {item.value.toLocaleString("pt-BR")}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: theme.textSecondary, textTransform: "uppercase", letterSpacing: "0.06em" }}>Transações Recentes</p>
          <div style={{ display: "flex", gap: 8 }}>
            {[["all", "Todas"], ["income", "Receitas"], ["expense", "Despesas"]].map(([val, label]) => (
              <button key={val} onClick={() => setFilter(val)}
                style={{ padding: "5px 12px", borderRadius: 8, border: `1px solid ${filter === val ? theme.primary : theme.border}`, background: filter === val ? theme.primaryLight : "transparent", color: filter === val ? theme.primary : theme.textSecondary, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit" }}>
                {label}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {filtered.map((t, i) => (
            <motion.div key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
              style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 14px", borderRadius: 12, background: i % 2 === 0 ? theme.surfaceAlt : "transparent" }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: t.type === "income" ? theme.successLight : theme.dangerLight, display: "flex", alignItems: "center", justifyContent: "center", color: t.type === "income" ? theme.success : theme.danger }}>
                <Icon d={icons[t.type === "income" ? "arrowUp" : "arrowDown"]} size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: theme.text }}>{t.description}</p>
                <p style={{ fontSize: 12, color: theme.textMuted }}>{new Date(t.date).toLocaleDateString("pt-BR")} • {t.category} • {t.method}</p>
              </div>
              <p style={{ fontSize: 15, fontWeight: 800, color: t.type === "income" ? theme.success : theme.danger }}>
                {t.type === "income" ? "+" : "-"}R$ {t.amount.toLocaleString("pt-BR")}
              </p>
            </motion.div>
          ))}
        </div>
      </Card>

      {showModal && (
        <Modal title="Nova Transação" onClose={() => setShowModal(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", gap: 10 }}>
              {[["income", "Receita"], ["expense", "Despesa"]].map(([val, label]) => (
                <button key={val} style={{ flex: 1, padding: "10px", borderRadius: 10, border: `2px solid ${val === "income" ? theme.success : theme.danger}`, background: val === "income" ? theme.successLight : theme.dangerLight, color: val === "income" ? "#065F46" : "#9B1C1C", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, fontSize: 14 }}>
                  {label}
                </button>
              ))}
            </div>
            <Input label="Descrição" placeholder="Consulta, Medicamento..." />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Input label="Valor (R$)" placeholder="0,00" type="number" />
              <Input label="Data" type="date" />
            </div>
            <Input label="Categoria" placeholder="Consulta, Estoque..." />
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
              <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
              <Button onClick={() => setShowModal(false)}>Registrar</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── MOBILE NAV ────────────────────────────────────────────────────────────
const MobileNav = ({ active, setActive }) => (
  <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: theme.surface, borderTop: `1px solid ${theme.border}`, display: "flex", zIndex: 100, padding: "8px 0 12px" }}>
    {navItems.map(item => (
      <button key={item.id} onClick={() => setActive(item.id)}
        style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, border: "none", background: "transparent", cursor: "pointer", padding: "6px 4px", color: active === item.id ? theme.primary : theme.textMuted, fontFamily: "inherit" }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: active === item.id ? theme.primaryLight : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
          <Icon d={icons[item.icon]} size={18} />
        </div>
        <span style={{ fontSize: 10, fontWeight: active === item.id ? 700 : 500 }}>{item.label}</span>
      </button>
    ))}
  </div>
);

// ─── LOGIN PAGE ────────────────────────────────────────────────────────────
const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("demo@vetcare.com.br");
  const [password, setPassword] = useState("demo123");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(); }, 1200);
  };

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        {[...Array(6)].map((_, i) => (
          <motion.div key={i} animate={{ y: [0, -30, 0], rotate: [0, 10, 0] }} transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.8 }}
            style={{ position: "absolute", left: `${10 + i * 16}%`, top: `${20 + (i % 3) * 25}%`, fontSize: 40 + i * 10, opacity: 0.04 }}>
            🐾
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 30, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ background: theme.surface, borderRadius: 24, border: `1px solid ${theme.border}`, padding: 40, width: "100%", maxWidth: 420, boxShadow: "0 24px 80px rgba(0,0,0,0.1)", position: "relative", zIndex: 1 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}
            style={{ width: 64, height: 64, borderRadius: 18, background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryMid})`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 32 }}>
            🐾
          </motion.div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: theme.text, letterSpacing: "-0.03em" }}>VetCare</h1>
          <p style={{ fontSize: 14, color: theme.textSecondary, marginTop: 4 }}>Sistema de Gestão Veterinária</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input label="Email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com.br" icon="users" type="email" />
          <Input label="Senha" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" type="password" icon="shield" />

          <motion.button onClick={handleLogin} disabled={loading}
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
            style={{ width: "100%", padding: "14px", borderRadius: 12, border: "none", background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryMid})`, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {loading ? (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                style={{ width: 20, height: 20, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%" }} />
            ) : "Entrar no VetCare"}
          </motion.button>
        </div>

        <div style={{ marginTop: 24, padding: 16, background: theme.primaryLight, borderRadius: 12, textAlign: "center" }}>
          <p style={{ fontSize: 12, color: theme.primary, fontWeight: 600 }}>Acesso Demo</p>
          <p style={{ fontSize: 12, color: theme.textSecondary, marginTop: 2 }}>demo@vetcare.com.br • demo123</p>
        </div>

        <p style={{ textAlign: "center", fontSize: 12, color: theme.textMuted, marginTop: 20 }}>
          Não tem conta? <span style={{ color: theme.primary, fontWeight: 600, cursor: "pointer" }}>Criar gratuitamente</span>
        </p>
      </motion.div>
    </div>
  );
};

// ─── MAIN APP ──────────────────────────────────────────────────────────────
export default function VetCare() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isLoggedIn) return <LoginPage onLogin={() => setIsLoggedIn(true)} />;

  const pages = { dashboard: Dashboard, clients: Clients, pets: Pets, agenda: Agenda, vaccines: Vaccines, financial: Financial };
  const PageComponent = pages[activePage];
  const sidebarWidth = isMobile ? 0 : sidebarCollapsed ? 68 : 240;

  return (
    <div style={{ fontFamily: "'DM Sans', 'Figtree', 'Inter', system-ui, sans-serif", background: theme.bg, minHeight: "100vh" }}>
      {!isMobile && <Sidebar active={activePage} setActive={setActivePage} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />}

      <motion.main
        animate={{ marginLeft: sidebarWidth, paddingBottom: isMobile ? 80 : 0 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        style={{ padding: isMobile ? "20px 16px" : "28px 32px", minHeight: "100vh" }}>

        {/* Mobile Header */}
        {isMobile && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryMid})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🐾</div>
              <p style={{ fontSize: 18, fontWeight: 800, color: theme.text }}>VetCare</p>
            </div>
            <button style={{ width: 36, height: 36, borderRadius: 10, background: theme.surface, border: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: theme.textSecondary }}>
              <Icon d={icons.bell} size={18} />
            </button>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div key={activePage} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
            <PageComponent />
          </motion.div>
        </AnimatePresence>
      </motion.main>

      {isMobile && <MobileNav active={activePage} setActive={setActivePage} />}
    </div>
  );
}
 