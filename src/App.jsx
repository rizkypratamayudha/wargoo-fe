import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip"; // <-- Import ini
import MainLayout from "./layouts/MainLayouts";
import Home from "./pages/Home";
import "./App.css";
import User from "./pages/master/user/User";
import ListRumah from "./pages/master/rumah/List";
import ListIuran from "./pages/master/iuran/List";
import ListKategoriPengeluaran from "./pages/master/kategoriPengeluaran/List";
import ListPenghuni from "./pages/master/penghuni/List";
import ListHunian from "./pages/hunian/List";

function App() {
  return (
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />\
            {/* master */}
            <Route path="master/users" element={<User />} />
            <Route path="master/house" element={<ListRumah />} />
            <Route path="master/iuran" element={<ListIuran />} />
            <Route path="master/kategori-pengeluaran" element={<ListKategoriPengeluaran />} />
            <Route path="master/penghuni" element={<ListPenghuni />} />
            {/* hunian */}
            <Route path="hunian" element={<ListHunian />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  );
}

export default App;
