import { Navigate, Route, Routes } from "react-router-dom";
import OtpPage from "../pages/UserAuthentication/OtpPage";
import ForgotPassword from "../pages/UserAuthentication/ForgotPassword";
import LoginPage from "../pages/UserAuthentication/SignInSignUp";
import ResetPassword from "../pages/UserAuthentication/ResetPassword";
import Dashboard from "../pages/Dashboard/Dashboard";
import ExpensesPage from "../pages/Expenses/ExpensesPage";
import IncomePage from "../pages/Income/IncomePage";
import BudgetPage from "../pages/Budget/BudgetPage";
import TransactionsPage from "../pages/Transactions/TransactionsPage";
import ProtectedRoute from "../components/ProtectedRoute";
import DashboardLayout from "../components/DashboardLayout";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<LoginPage />} />
      <Route path="/auth/verify-otp" element={<OtpPage />} />
      <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth/reset-password" element={<ResetPassword />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/expenses"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ExpensesPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/income"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <IncomePage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/budget"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <BudgetPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <TransactionsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
