import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClerkProvider } from "@clerk/clerk-react";
import AuthInterceptorProvider from "./providers/auth-interceptor-provider";
import "./index.css";
import router from "./routes";
import { ThemeProvider } from "./providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
const queryClient = new QueryClient();

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error("Missing Clerk Publishable Key");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <AuthInterceptorProvider>
        <ThemeProvider
          defaultTheme="system"
          storageKey="codesphere-ui-theme"
        >
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            <Toaster
              richColors
              closeButton
            />
          </QueryClientProvider>
        </ThemeProvider>
      </AuthInterceptorProvider>
    </ClerkProvider>
  </StrictMode>
);
