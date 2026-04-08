import { useState, type ReactNode } from "react";
import { AppContext } from "./hooks/AppContex";
import { AuthContext } from "./hooks/useAuth";
import { ThemeProvider } from "./ThemeContext";

// AppContext
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [email, setEmail] = useState("");

  return (
    <AppContext.Provider value={{ email, setEmail }}>
      {children}
    </AppContext.Provider>
  );
};

// AuthContext
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );
  const [userRole, setUserRole] = useState<string | null>(
    localStorage.getItem("userRole"),
  );

  const setAuth = (token: string, userRole: string) => {
    setToken(token);
    setUserRole(userRole);
    localStorage.setItem("token", token);
    localStorage.setItem("userRole", userRole);
  };

  const logout = () => {
    setToken(null);
    setUserRole(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
  };

  return (
    <AuthContext.Provider value={{ token, userRole, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const ContextProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider>
      <AppProvider>
        <AuthProvider>{children}</AuthProvider>
      </AppProvider>
    </ThemeProvider>
  );
};

export default ContextProvider;
