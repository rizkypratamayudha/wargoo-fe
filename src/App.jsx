import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import MainLayout from "./layouts/MainLayouts";
import Login from "./pages/Login";
import Home from "./pages/Home";
import "./App.css";
import User from "./pages/master/user/User";
import ListRumah from "./pages/master/rumah/List";
import ListIuran from "./pages/master/iuran/List";
import ListKategoriPengeluaran from "./pages/master/kategoriPengeluaran/List";
import ListPenghuni from "./pages/master/penghuni/List";
import ListHunian from "./pages/hunian/List";
import ListTagihan from "./pages/tagihan/List";
import ListPembayaran from "./pages/pembayaran/List";
import ListPengeluaran from "./pages/pengeluaran/List";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        {/* master */}
        <Route path="master/users" element={<User />} />
        <Route path="master/house" element={<ListRumah />} />
        <Route path="master/iuran" element={<ListIuran />} />
        <Route path="master/kategori-pengeluaran" element={<ListKategoriPengeluaran />} />
        <Route path="master/penghuni" element={<ListPenghuni />} />
        {/* hunian */}
        <Route path="hunian" element={<ListHunian />} />
        {/* tagihan */}
        <Route path="tagihan" element={<ListTagihan />} />
        {/* pembayaran */}
        <Route path="pembayaran" element={<ListPembayaran />} />
        {/* pengeluaran */}
        <Route path="pengeluaran" element={<ListPengeluaran />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <TooltipProvider>
      <Toaster richColors position="top-right" />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  );
}

export default App;
