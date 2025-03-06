import { Bell, Search, PenSquare, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router";
import { SignedOut, SignedIn, UserButton } from "@clerk/clerk-react";
import { useAuth } from "@clerk/clerk-react";
import { Skeleton } from "../ui/skeleton";
import apiClient from "@/lib/api-client";

const MainHeader = () => {
  const { getToken } = useAuth();

  const remove = async () => {
    try {
      // Get token using the official Clerk method
      const token = await getToken();
      console.log("Auth token available:", !!token);

      if (!token) {
        console.error("No authentication token available");
        return;
      }

      const response = await apiClient.delete("/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("User successfully deleted:", response.data);
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

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
        <SignedIn>
          <Button
            onClick={() => {
              remove();
            }}
            variant="ghost"
            size="sm"
          >
            Remove Account
          </Button>
        </SignedIn>

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

          <Link to="/notifications">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-red-500"></span>
            </Button>
          </Link>

          <SignedIn>
            <div className="flex items-center">
              <UserButton
                afterSignOutUrl="/"
                userProfileUrl="/me/profile"
              />
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="ml-1"
              >
                <Link to="/me/profile">
                  <User className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>
              </Button>
            </div>
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
        </div>
      </div>
    </header>
  );
};

export default MainHeader;
