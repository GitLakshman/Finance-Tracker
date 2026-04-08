import axios from "axios";
import type {
  Budget,
  BudgetSummary,
  Category,
  Expense,
  Income,
  PageResponse,
  Transaction,
  TransactionType,
} from "../types/financeTypes";

const BASE_URL = "http://localhost:8080/api";

// ─── Axios instance with auth header ─────────────────────────────────────────

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Expense API ─────────────────────────────────────────────────────────────

export interface ExpensePayload {
  amount: number;
  category: Category;
  description?: string;
  date: string;
}

export const addExpense = (data: ExpensePayload) =>
  api.post<Expense>("/expense/add", data);

export const getExpenses = (page = 0, size = 10) =>
  api.get<PageResponse<Expense>>("/expense/all", { params: { page, size } });

export const filterExpenses = (month: string, category?: Category) =>
  api.get<Expense[]>("/expense/filter", { params: { month, category } });

export const deleteExpense = (id: number) =>
  api.delete<string>(`/expense/${id}`);

// ─── Income API ───────────────────────────────────────────────────────────────

export interface IncomePayload {
  source: string;
  amount: number;
  frequency: string;
  isRecurring: boolean;
  startDate: string;
  description?: string;
}

export const addIncome = (data: IncomePayload) =>
  api.post<Income>("/income/add", data);

export const getIncomes = (page = 0, size = 10) =>
  api.get<PageResponse<Income>>("/income/all", { params: { page, size } });

export const deleteIncome = (id: number) =>
  api.delete<string>(`/income/${id}`);

// ─── Budget API ───────────────────────────────────────────────────────────────

export interface BudgetPayload {
  category: Category;
  budgetAmount: number;
  month: string;
}

export const setBudget = (data: BudgetPayload) =>
  api.post<Budget>("/budget/set", data);

export const getBudgets = (month: string) =>
  api.get<Budget[]>("/budget/all", { params: { month } });

export const getBudgetSummary = (month: string) =>
  api.get<BudgetSummary[]>("/budget/summary", { params: { month } });

// ─── Transaction API ──────────────────────────────────────────────────────────

export interface TransactionFilters {
  type?: TransactionType;
  dateFrom?: string;
  dateTo?: string;
  keyword?: string;
}

export const getTransactionHistory = (
  page = 0,
  size = 10,
  filters: TransactionFilters = {}
) =>
  api.get<PageResponse<Transaction>>("/transaction/history", {
    params: { page, size, ...filters },
  });
