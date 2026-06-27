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
import { ChevronRight, Database, Home, Key, LayoutDashboard, Users } from "lucide-react";

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
        <span className="text-sm text-zinc-500">Logged In</span>
      </SidebarFooter>
    </Sidebar>
  );
}
