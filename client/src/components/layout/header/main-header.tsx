import { Logo } from "./Logo";
import { SearchBar } from "./search-bar";
import { WriteButton } from "./write-button";
import { NotificationButton } from "./notification-button";
import { UserMenu } from "./user-menu";

const MainHeader = () => {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-8 flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Logo />
        </div>

        <div className="flex-1 flex items-center justify-center px-2">
          <SearchBar />
        </div>

        <div className="flex items-center space-x-4">
          <WriteButton />
          <NotificationButton />
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default MainHeader;
