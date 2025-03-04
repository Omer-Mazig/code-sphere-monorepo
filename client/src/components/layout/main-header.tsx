import { Bell, Search, PenSquare } from "lucide-react";
import { currentUser } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router";

const MainHeader = () => {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-8 flex h-14 items-center ">
        <div className="mr-4 flex items-center">
          <Link
            to="/"
            className="flex items-center space-x-2"
          >
            <span className="font-bold text-xl">CodeSphere</span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-2">
          <div className="w-full max-w-lg lg:max-w-xl relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search posts, users, or tags..."
              className="w-full pl-9"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            className="hidden md:flex items-center"
          >
            <PenSquare className="h-4 w-4 mr-1" />
            <span>Write</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="relative"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-red-500"></span>
          </Button>

          <Avatar>
            <AvatarImage
              src={currentUser.avatarUrl}
              alt={currentUser.username}
            />
            <AvatarFallback>
              {currentUser.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default MainHeader;
