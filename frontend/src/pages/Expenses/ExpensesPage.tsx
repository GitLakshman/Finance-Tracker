import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { addExpense, getExpenses, deleteExpense } from "../../services/finance";
import type { Expense, Category } from "../../types/financeTypes";

const CATEGORIES: Category[] = [
  "GROCERIES",
  "UTILITIES",
  "ENTERTAINMENT",
  "TRANSPORT",
  "OTHER",
];

const expenseSchema = z.object({
  amount: z.number().min(1, "Amount must be greater than 0"),
  category: z.enum(["GROCERIES", "UTILITIES", "ENTERTAINMENT", "TRANSPORT", "OTHER"] as const),
  description: z.string().optional(),
  date: z.string().min(1, "Date is required"),
});

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(n);

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  // Pagination
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const form = useForm<z.infer<typeof expenseSchema>>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
    },
  });

  const loadExpenses = async (pageNumber = 0) => {
    try {
      setLoading(true);
      const res = await getExpenses(pageNumber, 10);
      setExpenses(res.data.content);
      setTotalPages(res.data.totalPages);
      setPage(res.data.number);
    } catch (err) {
      console.error("Failed to load expenses", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses(0);
  }, []);

  const onSubmit = async (data: z.infer<typeof expenseSchema>) => {
    try {
      setAdding(true);
      await addExpense({
        amount: data.amount,
        category: data.category,
        description: data.description,
        date: data.date,
      });
      form.reset({ date: new Date().toISOString().split("T")[0] });
      setShowForm(false);
      loadExpenses(0);
    } catch (err) {
      console.error("Failed to add expense", err);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;
    try {
      await deleteExpense(id);
      loadExpenses(page);
    } catch (err) {
      console.error("Failed to delete expense", err);
    }
  };

  return (
    <div>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1>Expenses</h1>
          <p>Track your spending and outgoings</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Add Expense"}
        </button>
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
              <div style={{ fontWeight: 700, marginBottom: "1.25rem", fontSize: "1.1rem" }}>Add New Expense</div>
              <form onSubmit={form.handleSubmit(onSubmit)} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label className="label">Amount (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="input"
                    placeholder="0.00"
                    {...form.register("amount", { valueAsNumber: true })}
                  />
                  {form.formState.errors.amount && <span style={{ color: "var(--color-expense)", fontSize: "0.75rem", marginTop: "0.25rem" }}>{form.formState.errors.amount.message}</span>}
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label className="label">Category</label>
                  <select className="input" {...form.register("category")}>
                    <option value="">Select a category...</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {form.formState.errors.category && <span style={{ color: "var(--color-expense)", fontSize: "0.75rem", marginTop: "0.25rem" }}>{form.formState.errors.category.message}</span>}
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label className="label">Date</label>
                  <input
                    type="date"
                    className="input"
                    {...form.register("date")}
                  />
                  {form.formState.errors.date && <span style={{ color: "var(--color-expense)", fontSize: "0.75rem", marginTop: "0.25rem" }}>{form.formState.errors.date.message}</span>}
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label className="label">Description (Optional)</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="What was this for?"
                    {...form.register("description")}
                  />
                </div>

                <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end", marginTop: "0.5rem" }}>
                  <button type="submit" className="btn-primary" disabled={adding}>
                    {adding ? "Saving..." : "Save Expense"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--color-border)", background: "var(--color-surface-2)", fontWeight: 600, fontSize: "0.9rem" }}>
          Expense History
        </div>
        
        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--color-text-muted)" }}>Loading expenses...</div>
        ) : expenses.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--color-text-muted)" }}>No expenses recorded yet.</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--color-bg)", textAlign: "left", fontSize: "0.75rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                <th style={{ padding: "0.75rem 1.5rem", fontWeight: 600 }}>Date</th>
                <th style={{ padding: "0.75rem 1.5rem", fontWeight: 600 }}>Category</th>
                <th style={{ padding: "0.75rem 1.5rem", fontWeight: 600 }}>Description</th>
                <th style={{ padding: "0.75rem 1.5rem", fontWeight: 600, textAlign: "right" }}>Amount</th>
                <th style={{ padding: "0.75rem 1.5rem", fontWeight: 600, textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id} style={{ borderBottom: "1px solid var(--color-border)", transition: "background 0.15s" }}>
                  <td style={{ padding: "1rem 1.5rem", fontSize: "0.85rem" }}>{expense.date}</td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <span className="badge-expense">{expense.category}</span>
                  </td>
                  <td style={{ padding: "1rem 1.5rem", fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
                    {expense.description || "—"}
                  </td>
                  <td style={{ padding: "1rem 1.5rem", fontSize: "0.9rem", fontWeight: 600, textAlign: "right" }}>
                    {fmt(expense.amount)}
                  </td>
                  <td style={{ padding: "1rem 1.5rem", textAlign: "center" }}>
                    <button 
                      onClick={() => handleDelete(expense.id)}
                      style={{ background: "transparent", border: "none", color: "var(--color-expense)", cursor: "pointer", fontSize: "1.1rem", padding: "0.2rem 0.5rem", borderRadius: "0.25rem" }}
                      title="Delete"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 1.5rem", borderTop: "1px solid var(--color-border)", background: "var(--color-surface-2)" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
              Page {page + 1} of {totalPages}
            </span>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button 
                className="btn-ghost" 
                style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}
                disabled={page === 0}
                onClick={() => loadExpenses(page - 1)}
              >
                Previous
              </button>
              <button 
                className="btn-ghost" 
                style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}
                disabled={page >= totalPages - 1}
                onClick={() => loadExpenses(page + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpensesPage;
