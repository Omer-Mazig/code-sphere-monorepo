import { useAuth } from "@clerk/clerk-react";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isSignedIn, isLoaded } = useAuth();

  // Show loading state while Clerk is initializing
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  // Redirect to login if user is not signed in
  if (!isSignedIn) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // Render the protected content if authenticated
  return <>{children}</>;
}
