export interface AuthContextType {
  token: string | null;
  userRole: string | null;
  setAuth: (token: string, userRole: string) => void;
  logout: () => void;
}
