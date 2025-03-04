import { ReactNode } from "react";
import Navbar from "@/layout/navbar";
import RightSidebar from "@/layout/right-sidebar";
import { AppSidebar } from "@/layout/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-4">
        <SidebarProvider>
          <AppSidebar />
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <main className="col-span-1 md:col-span-12 lg:col-span-9">
              {children}
            </main>
            <aside className="hidden lg:block lg:col-span-3">
              <RightSidebar />
            </aside>
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
};

export default MainLayout;
