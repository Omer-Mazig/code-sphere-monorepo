import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClerkProvider } from "@clerk/clerk-react";
import AuthProvider from "./providers/auth-provider";
import "./index.css";
import router from "./routes";
import { ThemeProvider } from "./providers/theme-provider";

// Configure the query client with better defaults for caching
const queryClient = new QueryClient();

// Get the publishable key from environment variables
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Ensure the key is available
if (!clerkPubKey) {
  throw new Error("Missing Clerk Publishable Key");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <AuthProvider>
        <ThemeProvider
          defaultTheme="system"
          storageKey="codesphere-ui-theme"
        >
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
          </QueryClientProvider>
        </ThemeProvider>
      </AuthProvider>
    </ClerkProvider>
  </StrictMode>
);
