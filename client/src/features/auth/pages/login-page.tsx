import { SignIn } from "@clerk/clerk-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <SignIn
        routing="path"
        path="/login"
        signUpUrl="/register"
        redirectUrl="/"
      />
    </div>
  );
}
