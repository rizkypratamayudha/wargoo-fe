import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet } from "react-router-dom";

export default function Layout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full h-screen relative">
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
