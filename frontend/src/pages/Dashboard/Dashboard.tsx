import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  getExpenses,
  getIncomes,
  getBudgetSummary,
} from "../../services/finance";
import type { Expense, Income, BudgetSummary } from "../../types/financeTypes";
import { Link } from "react-router-dom";

const CATEGORY_COLORS: Record<string, string> = {
  GROCERIES: "#6366f1",
  UTILITIES: "#f59e0b",
  ENTERTAINMENT: "#ec4899",
  TRANSPORT: "#10b981",
  OTHER: "#94a3b8",
};

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const Dashboard = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [budgetSummary, setBudgetSummary] = useState<BudgetSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const currentMonth = new Date().toISOString().slice(0, 7);

  useEffect(() => {
    const load = async () => {
      try {
        const [expRes, incRes, budRes] = await Promise.all([
          getExpenses(0, 100),
          getIncomes(0, 100),
          getBudgetSummary(currentMonth),
        ]);
        setExpenses(expRes.data.content);
        setIncomes(incRes.data.content);
        setBudgetSummary(budRes.data);
      } catch (_) {
        // fail silently — fresh account with no data
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [currentMonth]);

  // ─── Summary stats ────────────────────────────────────────────────────
  const totalIncome = incomes.reduce((s, i) => s + i.amount, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const netBalance = totalIncome - totalExpenses;
  const savingsRate =
    totalIncome > 0 ? ((netBalance / totalIncome) * 100).toFixed(1) : "0";

  // ─── Area chart: last 6 months ────────────────────────────────────────
  const monthlyData = (() => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const label = MONTHS[d.getMonth()];
      const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const expTotal = expenses
        .filter((e) => e.date.startsWith(month))
        .reduce((s, e) => s + e.amount, 0);
      const incTotal = incomes
        .filter((inc) => inc.startDate.startsWith(month))
        .reduce((s, inc) => s + inc.amount, 0);
      return { month: label, income: incTotal, expenses: expTotal };
    });
  })();

  // ─── Pie chart: category breakdown ───────────────────────────────────
  const categoryData = (() => {
    const map: Record<string, number> = {};
    expenses.forEach((e) => {
      map[e.category] = (map[e.category] ?? 0) + e.amount;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  })();

  // ─── Recent transactions ──────────────────────────────────────────────
  const recent = [
    ...expenses.map((e) => ({
      type: "EXPENSE" as const,
      amount: e.amount,
      label: e.category,
      date: e.date,
    })),
    ...incomes.map((i) => ({
      type: "INCOME" as const,
      amount: i.amount,
      label: i.source,
      date: i.startDate,
    })),
  ]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  const summaryCards = [
    {
      label: "Total Income",
      value: fmt(totalIncome),
      color: "var(--color-income)",
      icon: "↗",
      sub: "All time",
    },
    {
      label: "Total Expenses",
      value: fmt(totalExpenses),
      color: "var(--color-expense)",
      icon: "↘",
      sub: "All time",
    },
    {
      label: "Net Balance",
      value: fmt(netBalance),
      color: netBalance >= 0 ? "var(--color-income)" : "var(--color-expense)",
      icon: "◈",
      sub: "Income − Expenses",
    },
    {
      label: "Savings Rate",
      value: `${savingsRate}%`,
      color: "var(--color-primary)",
      icon: "◎",
      sub: "Of total income",
    },
  ];

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "50vh",
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "3px solid var(--color-border)",
            borderTopColor: "var(--color-primary)",
          }}
        />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div
        className="page-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <h1>Dashboard</h1>
          <p>Your financial overview at a glance</p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Link to="/expenses">
            <button
              className="btn-primary"
              style={{ fontSize: "0.8rem", padding: "0.55rem 1.1rem" }}
            >
              + Add Expense
            </button>
          </Link>
          <Link to="/income">
            <button
              className="btn-ghost"
              style={{ fontSize: "0.8rem", padding: "0.55rem 1.1rem" }}
            >
              + Add Income
            </button>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1rem",
          marginBottom: "1.75rem",
        }}
      >
        {summaryCards.map((card, i) => (
          <motion.div
            key={card.label}
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            style={{ padding: "1.25rem" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "0.75rem",
              }}
            >
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "var(--color-text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {card.label}
              </span>
              <span style={{ fontSize: "1.2rem", color: card.color }}>
                {card.icon}
              </span>
            </div>
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: 800,
                color: card.color,
                letterSpacing: "-0.02em",
              }}
            >
              {card.value}
            </div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "var(--color-text-muted)",
                marginTop: "0.35rem",
              }}
            >
              {card.sub}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "1rem",
          marginBottom: "1.75rem",
        }}
      >
        {/* Area Chart */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ padding: "1.5rem" }}
        >
          <div
            style={{
              fontWeight: 700,
              color: "var(--color-text)",
              marginBottom: "1.25rem",
              fontSize: "0.95rem",
            }}
          >
            Income vs Expenses — Last 6 Months
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border)"
              />
              <XAxis
                dataKey="month"
                tick={{ fill: "var(--color-text-muted)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "var(--color-text-muted)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "0.75rem",
                  color: "var(--color-text)",
                }}
              />
              <Area
                type="monotone"
                dataKey="income"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#incomeGrad)"
                name="Income"
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stroke="#f43f5e"
                strokeWidth={2}
                fill="url(#expenseGrad)"
                name="Expenses"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          style={{ padding: "1.5rem" }}
        >
          <div
            style={{
              fontWeight: 700,
              color: "var(--color-text)",
              marginBottom: "1.25rem",
              fontSize: "0.95rem",
            }}
          >
            Expense Breakdown
          </div>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="45%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={CATEGORY_COLORS[entry.name] ?? "#94a3b8"}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => fmt(value)}
                  contentStyle={{
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "0.75rem",
                  }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{
                    fontSize: "0.75rem",
                    color: "var(--color-text-muted)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div
              style={{
                height: 220,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-text-muted)",
                gap: "0.5rem",
              }}
            >
              <span style={{ fontSize: "2rem" }}>📊</span>
              <span style={{ fontSize: "0.8rem" }}>No expense data yet</span>
            </div>
          )}
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}
      >
        {/* Recent Transactions */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{ padding: "1.5rem" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.25rem",
            }}
          >
            <div
              style={{
                fontWeight: 700,
                color: "var(--color-text)",
                fontSize: "0.95rem",
              }}
            >
              Recent Transactions
            </div>
            <Link
              to="/transactions"
              style={{
                fontSize: "0.75rem",
                color: "var(--color-primary)",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              View all →
            </Link>
          </div>
          {recent.length === 0 ? (
            <div
              style={{
                color: "var(--color-text-muted)",
                fontSize: "0.85rem",
                textAlign: "center",
                padding: "2rem 0",
              }}
            >
              No transactions yet
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              {recent.map((t, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "0.6rem",
                        background:
                          t.type === "INCOME"
                            ? "rgba(16,185,129,0.15)"
                            : "rgba(244,63,94,0.15)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.9rem",
                      }}
                    >
                      {t.type === "INCOME" ? "↗" : "↘"}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          color: "var(--color-text)",
                        }}
                      >
                        {t.label}
                      </div>
                      <div
                        style={{
                          fontSize: "0.7rem",
                          color: "var(--color-text-muted)",
                        }}
                      >
                        {t.date}
                      </div>
                    </div>
                  </div>
                  <span
                    style={{
                      fontWeight: 700,
                      color:
                        t.type === "INCOME"
                          ? "var(--color-income)"
                          : "var(--color-expense)",
                      fontSize: "0.9rem",
                    }}
                  >
                    {t.type === "INCOME" ? "+" : "-"}
                    {fmt(t.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Budget Overview */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          style={{ padding: "1.5rem" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.25rem",
            }}
          >
            <div
              style={{
                fontWeight: 700,
                color: "var(--color-text)",
                fontSize: "0.95rem",
              }}
            >
              Budget This Month
            </div>
            <Link
              to="/budget"
              style={{
                fontSize: "0.75rem",
                color: "var(--color-primary)",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Manage →
            </Link>
          </div>
          {budgetSummary.length === 0 ? (
            <div
              style={{
                color: "var(--color-text-muted)",
                fontSize: "0.85rem",
                textAlign: "center",
                padding: "2rem 0",
              }}
            >
              No budgets set for this month
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {budgetSummary.map((b) => (
                <div key={b.category}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "0.35rem",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        color: "var(--color-text)",
                      }}
                    >
                      {b.category}
                    </span>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--color-text-muted)",
                      }}
                    >
                      {fmt(b.actualSpend)} / {fmt(b.budgetAmount)}
                    </span>
                  </div>
                  <div
                    style={{
                      height: 7,
                      background: "var(--color-border)",
                      borderRadius: 999,
                      overflow: "hidden",
                    }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${b.percentUsed}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      style={{
                        height: "100%",
                        background:
                          b.percentUsed >= 90
                            ? "var(--color-expense)"
                            : b.percentUsed >= 70
                              ? "var(--color-warning)"
                              : "var(--color-income)",
                        borderRadius: 999,
                      }}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: "0.7rem",
                      color: "var(--color-text-muted)",
                      marginTop: "0.2rem",
                    }}
                  >
                    {b.percentUsed.toFixed(0)}% used
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
