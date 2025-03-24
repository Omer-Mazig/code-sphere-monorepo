import { ReactNode } from "react";
import MainHeader from "@/components/layout/header/main-header";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="grow">
        <MainHeader />
        <div className="container px-8 mx-auto mt-12 mb-12 xl:px-36">
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
