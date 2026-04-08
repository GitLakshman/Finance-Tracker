import { useState, useEffect, useCallback } from "react";
import { getTransactionHistory } from "../../services/finance";
import type { Transaction, TransactionType } from "../../types/financeTypes";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(n);

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Filters
  const [type, setType] = useState<TransactionType | "">("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [keyword, setKeyword] = useState("");

  const loadTransactions = useCallback(async (pageNumber = 0) => {
    try {
      setLoading(true);
      const res = await getTransactionHistory(pageNumber, 15, {
        type: type || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        keyword: keyword || undefined,
      });
      setTransactions(res.data.content);
      setTotalPages(res.data.totalPages);
      setPage(res.data.number);
    } catch (err) {
      console.error("Failed to load transactions", err);
    } finally {
      setLoading(false);
    }
  }, [type, dateFrom, dateTo, keyword]);

  useEffect(() => {
    loadTransactions(0);
  }, [loadTransactions]);

  const handleReset = () => {
    setType("");
    setDateFrom("");
    setDateTo("");
    setKeyword("");
    // The effect will re-trigger
  };

  return (
    <div>
      <div className="page-header">
        <h1>Transaction History</h1>
        <p>A unified view of all your incomings and outgoings</p>
      </div>

      <div className="card" style={{ padding: "1.25rem", marginBottom: "1.5rem", display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "flex-end" }}>
        <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column" }}>
          <label className="label">Search</label>
          <input 
            type="text" 
            className="input" 
            placeholder="Search descriptions, categories..." 
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        
        <div style={{ width: "150px", display: "flex", flexDirection: "column" }}>
          <label className="label">Type</label>
          <select className="input" value={type} onChange={(e) => setType(e.target.value as TransactionType | "")}>
            <option value="">All Types</option>
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
          </select>
        </div>

        <div style={{ width: "150px", display: "flex", flexDirection: "column" }}>
          <label className="label">From Date</label>
          <input type="date" className="input" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        </div>

        <div style={{ width: "150px", display: "flex", flexDirection: "column" }}>
          <label className="label">To Date</label>
          <input type="date" className="input" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        </div>

        <button className="btn-ghost" onClick={handleReset} style={{ height: "42px" }}>
          Clear Filters
        </button>
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--color-text-muted)" }}>Loading transactions...</div>
        ) : transactions.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--color-text-muted)" }}>No transactions found matching your filters.</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--color-bg)", textAlign: "left", fontSize: "0.75rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                <th style={{ padding: "0.75rem 1.5rem", fontWeight: 600 }}>Date</th>
                <th style={{ padding: "0.75rem 1.5rem", fontWeight: 600 }}>Type</th>
                <th style={{ padding: "0.75rem 1.5rem", fontWeight: 600 }}>Details (Category/Source)</th>
                <th style={{ padding: "0.75rem 1.5rem", fontWeight: 600 }}>Description</th>
                <th style={{ padding: "0.75rem 1.5rem", fontWeight: 600, textAlign: "right" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={`${t.type}-${t.id}`} style={{ borderBottom: "1px solid var(--color-border)", transition: "background 0.15s" }}>
                  <td style={{ padding: "1rem 1.5rem", fontSize: "0.85rem" }}>{t.date}</td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <span className={t.type === "INCOME" ? "badge-income" : "badge-expense"}>
                      {t.type}
                    </span>
                  </td>
                  <td style={{ padding: "1rem 1.5rem", fontWeight: 500 }}>
                    {t.type === "INCOME" ? t.source : t.category}
                  </td>
                  <td style={{ padding: "1rem 1.5rem", fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
                    {t.description || "—"}
                  </td>
                  <td style={{ 
                    padding: "1rem 1.5rem", 
                    fontSize: "0.9rem", 
                    fontWeight: 700, 
                    textAlign: "right",
                    color: t.type === "INCOME" ? "var(--color-income)" : "var(--color-expense)" 
                  }}>
                    {t.type === "INCOME" ? "+" : "-"}{fmt(t.amount)}
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
                onClick={() => loadTransactions(page - 1)}
              >
                Previous
              </button>
              <button 
                className="btn-ghost" 
                style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}
                disabled={page >= totalPages - 1}
                onClick={() => loadTransactions(page + 1)}
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

export default TransactionsPage;
