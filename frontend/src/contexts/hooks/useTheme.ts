import { createContext, useContext } from "react";
import type { ThemeContextType } from "../types/ThemeContextTypes";

export const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
};
