import { useAuth } from "@clerk/clerk-react";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface UnauthenticatedRouteProps {
  children: ReactNode;
}

export function UnauthenticatedRoute({ children }: UnauthenticatedRouteProps) {
  const { isSignedIn, isLoaded } = useAuth();

  // Show loading state while Clerk is initializing
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  // Redirect to home page if user is already signed in
  if (isSignedIn) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  // Render the content if not authenticated
  return <>{children}</>;
}
