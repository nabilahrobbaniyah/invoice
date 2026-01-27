import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/login";
import Clients from "./pages/clients";
import Invoices from "./pages/invoices";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/clients" element={
            <ProtectedRoute><Clients /></ProtectedRoute>
          } />
          <Route path="/invoices" element={
            <ProtectedRoute><Invoices /></ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
