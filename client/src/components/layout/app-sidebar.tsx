import { Home, Bookmark, Users, Hash, Settings } from "lucide-react";
import { Link } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import { popularTags } from "../../../../shared/constants/tags.constants";

export function AppSidebar() {
  const navItems = [
    { icon: Home, label: "Home", href: "/feed" },
    { icon: Bookmark, label: "Saved", href: "/saved" },
    { icon: Users, label: "Following", href: "/?filter=following" },
    { icon: Hash, label: "Tags", href: "/tags" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  return (
    <Sidebar
      side="left"
      variant="sidebar"
      collapsible="offcanvas"
      className="md:col-span-3 lg:col-span-2"
    >
      <SidebarHeader className="p-4">
        <h2 className="text-lg font-semibold">Code Sphere</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <h3 className="px-4 text-sm font-semibold mb-2">Navigation</h3>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild>
                  <Link
                    to={item.href}
                    className="flex items-center gap-3"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <h3 className="px-4 text-sm font-semibold mb-2">Popular Tags</h3>
          <SidebarMenu>
            {popularTags.map((tag) => (
              <SidebarMenuItem key={tag.value}>
                <SidebarMenuButton asChild>
                  <Link
                    to={`/tags/${tag.value}`}
                    className="flex items-center gap-3"
                  >
                    <Hash className="h-4 w-4" />
                    <span>{tag.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        {/* <p className="text-xs text-muted-foreground">© 2024 Code Sphere</p> */}
      </SidebarFooter>
    </Sidebar>
  );
}
