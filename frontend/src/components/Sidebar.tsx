import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/hooks/useAuth";
import { useTheme } from "../contexts/hooks/useTheme";
import { motion } from "framer-motion";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: "⊞" },
  { to: "/expenses", label: "Expenses", icon: "↘" },
  { to: "/income", label: "Income", icon: "↗" },
  { to: "/budget", label: "Budget", icon: "◎" },
  { to: "/transactions", label: "Transactions", icon: "↕" },
];

const Sidebar = () => {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside
      style={{
        background: "var(--color-sidebar)",
        borderRight: "1px solid var(--color-border)",
        width: "240px",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "1.5rem 1rem",
        position: "sticky",
        top: 0,
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div style={{ marginBottom: "2.5rem", padding: "0 0.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <div
            style={{
              width: "34px",
              height: "34px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1rem",
            }}
          >
            💰
          </div>
          <div>
            <div
              style={{
                color: "white",
                fontWeight: 800,
                fontSize: "0.95rem",
                letterSpacing: "-0.02em",
              }}
            >
              FinanceTrack
            </div>
            <div
              style={{
                color: "var(--color-sidebar-text)",
                fontSize: "0.65rem",
                fontWeight: 500,
              }}
            >
              Personal Finance
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem", flex: 1 }}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/dashboard"}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.65rem 0.9rem",
              borderRadius: "0.75rem",
              textDecoration: "none",
              fontSize: "0.875rem",
              fontWeight: isActive ? 700 : 500,
              color: isActive ? "white" : "var(--color-sidebar-text)",
              background: isActive
                ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                : "transparent",
              transition: "all 0.15s",
            })}
          >
            <span style={{ fontSize: "1rem", opacity: 0.85 }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Controls */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "1.5rem" }}>
        {/* Dark mode toggle */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.65rem 0.9rem",
            borderRadius: "0.75rem",
            border: "none",
            background: "transparent",
            color: "var(--color-sidebar-text)",
            fontSize: "0.875rem",
            fontWeight: 500,
            cursor: "pointer",
            width: "100%",
            textAlign: "left",
          }}
        >
          <span style={{ fontSize: "1rem" }}>{theme === "dark" ? "☀️" : "🌙"}</span>
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </motion.button>

        {/* Logout */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.65rem 0.9rem",
            borderRadius: "0.75rem",
            border: "none",
            background: "transparent",
            color: "#f87171",
            fontSize: "0.875rem",
            fontWeight: 500,
            cursor: "pointer",
            width: "100%",
            textAlign: "left",
          }}
        >
          <span style={{ fontSize: "1rem" }}>⎋</span>
          Logout
        </motion.button>
      </div>
    </aside>
  );
};

export default Sidebar;
