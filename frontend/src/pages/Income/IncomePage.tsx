import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { addIncome, getIncomes, deleteIncome } from "../../services/finance";
import type { Income, IncomeFrequency } from "../../types/financeTypes";

const FREQUENCIES: IncomeFrequency[] = ["DAILY", "WEEKLY", "MONTHLY", "YEARLY"];

const incomeSchema = z.object({
  source: z.string().min(1, "Source is required"),
  amount: z.number().min(1, "Amount must be greater than 0"),
  frequency: z.enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"] as const),
  isRecurring: z.boolean(),
  startDate: z.string().min(1, "Start Date is required"),
  description: z.string().optional(),
});

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(n);

const IncomePage = () => {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Pagination
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const form = useForm<z.infer<typeof incomeSchema>>({
    resolver: zodResolver(incomeSchema),
    defaultValues: {
      startDate: new Date().toISOString().split("T")[0],
      isRecurring: false,
    },
  });

  const loadIncomes = async (pageNumber = 0) => {
    try {
      setLoading(true);
      const res = await getIncomes(pageNumber, 10);
      setIncomes(res.data.content);
      setTotalPages(res.data.totalPages);
      setPage(res.data.number);
    } catch (err) {
      console.error("Failed to load incomes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIncomes(0);
  }, []);

  const onSubmit = async (data: z.infer<typeof incomeSchema>) => {
    try {
      setAdding(true);
      await addIncome({
        source: data.source,
        amount: data.amount,
        frequency: data.frequency,
        isRecurring: data.isRecurring,
        startDate: data.startDate,
        description: data.description,
      });
      form.reset({ startDate: new Date().toISOString().split("T")[0], isRecurring: false });
      setShowForm(false);
      loadIncomes(0);
    } catch (err) {
      console.error("Failed to add income", err);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this income entry?")) return;
    try {
      await deleteIncome(id);
      loadIncomes(page);
    } catch (err) {
      console.error("Failed to delete income", err);
    }
  };

  return (
    <div>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1>Income Management</h1>
          <p>Track your revenue streams</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Add Income"}
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
              <div style={{ fontWeight: 700, marginBottom: "1.25rem", fontSize: "1.1rem" }}>Add New Income Stream</div>
              <form onSubmit={form.handleSubmit(onSubmit)} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label className="label">Source Name</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g. Salary, Freelance project..."
                    {...form.register("source")}
                  />
                  {form.formState.errors.source && <span style={{ color: "var(--color-expense)", fontSize: "0.75rem", marginTop: "0.25rem" }}>{form.formState.errors.source.message}</span>}
                </div>

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
                  <label className="label">Frequency</label>
                  <select className="input" {...form.register("frequency")}>
                    <option value="">Select frequency...</option>
                    {FREQUENCIES.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                  {form.formState.errors.frequency && <span style={{ color: "var(--color-expense)", fontSize: "0.75rem", marginTop: "0.25rem" }}>{form.formState.errors.frequency.message}</span>}
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label className="label">Start Date</label>
                  <input
                    type="date"
                    className="input"
                    {...form.register("startDate")}
                  />
                  {form.formState.errors.startDate && <span style={{ color: "var(--color-expense)", fontSize: "0.75rem", marginTop: "0.25rem" }}>{form.formState.errors.startDate.message}</span>}
                </div>
                
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem", gridColumn: "1 / -1" }}>
                  <input type="checkbox" id="isRecurring" {...form.register("isRecurring")} style={{ width: "1.2rem", height: "1.2rem", accentColor: "var(--color-primary)" }} />
                  <label htmlFor="isRecurring" style={{ fontSize: "0.9rem", color: "var(--color-text)", fontWeight: 500, cursor: "pointer" }}>
                    This is a recurring income stream
                  </label>
                </div>

                <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column" }}>
                  <label className="label">Description (Optional)</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Additional context about this income..."
                    {...form.register("description")}
                  />
                </div>

                <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end", marginTop: "0.5rem" }}>
                  <button type="submit" className="btn-primary" disabled={adding} style={{ background: "linear-gradient(135deg, var(--color-income), #059669)" }}>
                    {adding ? "Saving..." : "Save Income"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--color-border)", background: "var(--color-surface-2)", fontWeight: 600, fontSize: "0.9rem" }}>
          Income History
        </div>
        
        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--color-text-muted)" }}>Loading income records...</div>
        ) : incomes.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--color-text-muted)" }}>No income sources recorded yet.</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--color-bg)", textAlign: "left", fontSize: "0.75rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                <th style={{ padding: "0.75rem 1.5rem", fontWeight: 600 }}>Start Date</th>
                <th style={{ padding: "0.75rem 1.5rem", fontWeight: 600 }}>Source</th>
                <th style={{ padding: "0.75rem 1.5rem", fontWeight: 600 }}>Frequency</th>
                <th style={{ padding: "0.75rem 1.5rem", fontWeight: 600 }}>Recurring</th>
                <th style={{ padding: "0.75rem 1.5rem", fontWeight: 600, textAlign: "right" }}>Amount</th>
                <th style={{ padding: "0.75rem 1.5rem", fontWeight: 600, textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {incomes.map((inc) => (
                <tr key={inc.id} style={{ borderBottom: "1px solid var(--color-border)", transition: "background 0.15s" }}>
                  <td style={{ padding: "1rem 1.5rem", fontSize: "0.85rem" }}>{inc.startDate}</td>
                  <td style={{ padding: "1rem 1.5rem", fontWeight: 500 }}>{inc.source}</td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <span className="badge-income">{inc.frequency}</span>
                  </td>
                  <td style={{ padding: "1rem 1.5rem", fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
                    {inc.isRecurring ? "Yes" : "No"}
                  </td>
                  <td style={{ padding: "1rem 1.5rem", fontSize: "0.9rem", fontWeight: 600, textAlign: "right", color: "var(--color-income)" }}>
                    {fmt(inc.amount)}
                  </td>
                  <td style={{ padding: "1rem 1.5rem", textAlign: "center" }}>
                    <button 
                      onClick={() => handleDelete(inc.id)}
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
                onClick={() => loadIncomes(page - 1)}
              >
                Previous
              </button>
              <button 
                className="btn-ghost" 
                style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}
                disabled={page >= totalPages - 1}
                onClick={() => loadIncomes(page + 1)}
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

export default IncomePage;
