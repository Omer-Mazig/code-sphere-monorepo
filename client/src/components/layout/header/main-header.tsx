import { SearchBar } from "./search-bar";
import { WriteButton } from "./write-button";
import { NotificationButton } from "./notification-button";
import { UserMenu } from "./user-menu";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ModeToggle } from "@/components/shared/mode-toggle";
import { Logo } from "./logo";

// TODO: show write button for non-authenticated users. then open a dialog to sign in
// TODO: responsive design for small screens
const MainHeader = () => {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-8 flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Logo />
        </div>

        <div className="flex-1 flex items-center justify-center px-2">
          <SearchBar />
        </div>

        <div className="flex items-center space-x-4">
          <SignedIn>
            <WriteButton />
            <NotificationButton />
            <UserMenu />
          </SignedIn>
          <SignedOut>
            <Button
              variant="default"
              size="sm"
              asChild
            >
              <Link to="/login">Sign In</Link>
            </Button>
          </SignedOut>
          <div>
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default MainHeader;
