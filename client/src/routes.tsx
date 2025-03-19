import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "@/components/layout/main-layout";
import PostFeedPage from "@/features/feed/pages/post-feed-page";
import PostDetailPage from "@/features/feed/pages/post-detail-page";
import NewPostPage from "@/features/feed/pages/new-post-page";

import LoginPage from "@/features/auth/pages/login-page";
import RegisterPage from "@/features/auth/pages/register-page";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { UnauthenticatedRoute } from "@/components/auth/unauthenticated-route";
import ProfilePage from "./features/user/pages/profile-page";
import MyProfilePage from "./features/user/pages/my-profile-page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/feed" />,
  },
  {
    path: "/feed",
    element: (
      <MainLayout>
        <PostFeedPage />
      </MainLayout>
    ),
  },
  {
    path: "/posts/:id",
    element: (
      <MainLayout>
        <PostDetailPage />
      </MainLayout>
    ),
  },
  {
    path: "/posts/new",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <NewPostPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile/:userId",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <ProfilePage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/me/profile",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <MyProfilePage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/tags/:tag",
    element: (
      <MainLayout>
        <PostFeedPage />
      </MainLayout>
    ),
  },
  {
    path: "/login",
    element: (
      <UnauthenticatedRoute>
        <LoginPage />
      </UnauthenticatedRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <UnauthenticatedRoute>
        <RegisterPage />
      </UnauthenticatedRoute>
    ),
  },
]);

export default router;
