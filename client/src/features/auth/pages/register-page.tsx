import { SignUp } from "@clerk/clerk-react";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <SignUp
        routing="path"
        path="/register"
        signInUrl="/login"
        redirectUrl="/"
      />
    </div>
  );
}
