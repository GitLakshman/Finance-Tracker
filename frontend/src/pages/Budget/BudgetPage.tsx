import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { setBudget, getBudgetSummary } from "../../services/finance";
import type { BudgetSummary, Category } from "../../types/financeTypes";

const CATEGORIES: Category[] = [
  "GROCERIES",
  "UTILITIES",
  "ENTERTAINMENT",
  "TRANSPORT",
  "OTHER",
];

const budgetSchema = z.object({
  category: z.enum(["GROCERIES", "UTILITIES", "ENTERTAINMENT", "TRANSPORT", "OTHER"] as const),
  budgetAmount: z.number().min(1, "Budget amount must be greater than 0"),
  month: z.string().regex(/^\d{4}-\d{2}$/, "Month must be in YYYY-MM format"),
});

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const BudgetPage = () => {
  const [summaries, setSummaries] = useState<BudgetSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  // Current selected month for viewing/setting
  const [selectedMonth, setSelectedMonth] = useState(() => new Date().toISOString().slice(0, 7));

  const form = useForm<z.infer<typeof budgetSchema>>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      month: selectedMonth,
    },
  });

  const loadBudgets = async (month: string) => {
    try {
      setLoading(true);
      const res = await getBudgetSummary(month);
      setSummaries(res.data);
    } catch (err) {
      console.error("Failed to load budgets", err);
      setSummaries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBudgets(selectedMonth);
    form.setValue("month", selectedMonth);
  }, [selectedMonth]);

  const onSubmit = async (data: z.infer<typeof budgetSchema>) => {
    try {
      setSaving(true);
      await setBudget({
        category: data.category,
        budgetAmount: data.budgetAmount,
        month: data.month,
      });
      setShowForm(false);
      form.reset({ month: selectedMonth });
      // Reload if we just updated the currently viewed month
      if (data.month === selectedMonth) {
        loadBudgets(selectedMonth);
      } else {
        setSelectedMonth(data.month);
      }
    } catch (err) {
      console.error("Failed to set budget", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1>Budget Planning</h1>
          <p>Set targets and monitor your spending</p>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          {/* Month selector for the view */}
          <input 
            type="month" 
            className="input" 
            style={{ width: "auto", padding: "0.4rem 1rem" }}
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "+ Set Budget"}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: "1.75rem" }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            style={{ overflow: "hidden" }}
          >
            <div className="card" style={{ padding: "1.5rem" }}>
              <div style={{ fontWeight: 700, marginBottom: "1.25rem", fontSize: "1.1rem" }}>Set Category Budget</div>
              <form onSubmit={form.handleSubmit(onSubmit)} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label className="label">Category</label>
                  <select className="input" {...form.register("category")}>
                    <option value="">Select a category...</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {form.formState.errors.category && <span style={{ color: "var(--color-expense)", fontSize: "0.75rem", marginTop: "0.25rem" }}>{form.formState.errors.category.message}</span>}
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label className="label">Budget Amount (₹)</label>
                  <input
                    type="number"
                    step="1"
                    className="input"
                    placeholder="0"
                    {...form.register("budgetAmount", { valueAsNumber: true })}
                  />
                  {form.formState.errors.budgetAmount && <span style={{ color: "var(--color-expense)", fontSize: "0.75rem", marginTop: "0.25rem" }}>{form.formState.errors.budgetAmount.message}</span>}
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label className="label">Target Month</label>
                  <input
                    type="month"
                    className="input"
                    {...form.register("month")}
                  />
                  {form.formState.errors.month && <span style={{ color: "var(--color-expense)", fontSize: "0.75rem", marginTop: "0.25rem" }}>{form.formState.errors.month.message}</span>}
                </div>

                <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end", marginTop: "0.5rem" }}>
                  <button type="submit" className="btn-primary" disabled={saving} style={{ background: "linear-gradient(135deg, var(--color-warning), #d97706)" }}>
                    {saving ? "Saving..." : "Save Budget"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Budget Overview Cards */}
      {loading ? (
        <div style={{ padding: "3rem", textAlign: "center", color: "var(--color-text-muted)" }}>Loading budget summary...</div>
      ) : summaries.length === 0 ? (
        <div className="card" style={{ padding: "3rem", textAlign: "center", color: "var(--color-text-muted)" }}>
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🎯</div>
          No budgets set for {new Date(selectedMonth + "-01").toLocaleString('default', { month: 'long', year: 'numeric' })}.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
          {summaries.map((b) => {
            const isOver = b.percentUsed >= 100;
            const isWarning = b.percentUsed >= 80 && !isOver;
            const barColor = isOver ? "var(--color-expense)" : isWarning ? "var(--color-warning)" : "var(--color-income)";
            
            return (
              <motion.div 
                key={b.category}
                className="card" 
                style={{ padding: "1.5rem" }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                  <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>{b.category}</div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--color-text)", lineHeight: 1 }}>
                      {fmt(b.actualSpend)}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "0.2rem" }}>
                      of {fmt(b.budgetAmount)}
                    </div>
                  </div>
                </div>

                <div style={{ height: 10, background: "var(--color-border)", borderRadius: 999, overflow: "hidden", marginBottom: "0.75rem" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(b.percentUsed, 100)}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    style={{
                      height: "100%",
                      background: barColor,
                      borderRadius: 999,
                    }}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", fontWeight: 600 }}>
                  <span style={{ color: barColor }}>
                    {b.percentUsed.toFixed(1)}% used
                  </span>
                  <span style={{ color: isOver ? "var(--color-expense)" : "var(--color-text-muted)" }}>
                    {isOver ? (
                      <>Over by {fmt(Math.abs(b.remaining))}</>
                    ) : (
                      <>{fmt(b.remaining)} left</>
                    )}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BudgetPage;
