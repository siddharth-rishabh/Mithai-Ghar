import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/loginPage";
import SignupPage from "../pages/signupPages";
import Dashboard from "../pages/dashboard";
import ProductsPage from "../pages/homePage";
import ProtectedRoute from "../components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/products" element={<ProductsPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}
