// ─── Enums ────────────────────────────────────────────────────────────────────

export type Category =
  | "GROCERIES"
  | "UTILITIES"
  | "ENTERTAINMENT"
  | "TRANSPORT"
  | "OTHER";

export type IncomeFrequency = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";

export type TransactionType = "INCOME" | "EXPENSE";

// ─── Domain Types ─────────────────────────────────────────────────────────────

export interface Expense {
  id: number;
  userId: string;
  amount: number;
  category: Category;
  description?: string;
  date: string; // ISO date string YYYY-MM-DD
  createdAt: string;
}

export interface Income {
  id: number;
  userId: string;
  source: string;
  amount: number;
  frequency: IncomeFrequency;
  isRecurring: boolean;
  startDate: string;
  description?: string;
  createdAt: string;
}

export interface Budget {
  id: number;
  userId: string;
  category: Category;
  budgetAmount: number;
  month: string; // YYYY-MM
  createdAt: string;
  updatedAt: string;
}

export interface BudgetSummary {
  category: Category;
  budgetAmount: number;
  actualSpend: number;
  remaining: number;
  percentUsed: number;
}

export interface Transaction {
  id: number;
  type: TransactionType;
  amount: number;
  category?: Category;
  source?: string;
  description?: string;
  date: string;
}

// ─── Paginated Response ───────────────────────────────────────────────────────

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // current page
  size: number;
  first: boolean;
  last: boolean;
}
