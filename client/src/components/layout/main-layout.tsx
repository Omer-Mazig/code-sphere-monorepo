import { ReactNode } from "react";
import RightSidebar from "@/components/layout/right-sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import MainHeader from "@/components/layout/main-header";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <SidebarProvider>
        <AppSidebar />
        <div className="grow">
          <MainHeader />
          <div className="container px-8 mx-auto mt-12 grid grid-cols-1 md:grid-cols-12 gap-4">
            <main className="col-span-1 md:col-span-12 lg:col-span-9">
              {children}
            </main>
            <aside className="hidden lg:block lg:col-span-3">
              <RightSidebar />
            </aside>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default MainLayout;
