import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Link } from "react-router-dom";
import { ChevronRight, Database, Home, Key, LayoutDashboard, LogOut, Receipt, TrendingDown, Users, Wallet } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

// Data menu yang sudah mendukung fitur Dropdown (Sub-menu)
const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Hunian",
    url: "hunian",
    icon: Home,
  },
  {
    title: "Tagihan",
    url: "tagihan",
    icon: Receipt,
  },
  {
    title: "Pembayaran",
    url: "pembayaran",
    icon: Wallet,
  },
  {
    title: "Pengeluaran",
    url: "pengeluaran",
    icon: TrendingDown,
  },
  {
    title: "Master Data", icon: Database,
    items: [
      { title: "Users", url: "master/users",  },
      { title: "House", url: "master/house", },
      { title: "Iuran", url: "master/iuran", },
      { title: "Pengeluaran", url: "master/kategori-pengeluaran", },
      { title: "Penghuni", url: "master/penghuni", },
    ],
  },
];

export function AppSidebar() {
  const { user, logout } = useAuth();

  return (
    <Sidebar>
      <SidebarHeader className="p-4 font-bold text-lg border-b">
        Wargoo
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {menuItems.map((item) => {
              // Jika menu tersebut MEMILIKI anak (items), render sebagai Dropdown
              if (item.items && item.items.length > 0) {
                return (
                  <Collapsible key={item.title} className="group/collapsible">
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="w-full">
                          {/* Render ikon jika ada */}
                          {item.icon && <item.icon />}

                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                <Link to={subItem.url}>
                                  {subItem.icon && <subItem.icon />}
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                );
              }

              // Jika TIDAK punya anak, render sebagai menu biasa
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground truncate">{user?.name}</span>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={logout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
