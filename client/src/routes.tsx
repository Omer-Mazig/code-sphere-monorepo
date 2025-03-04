import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/components/layout/main-layout";
import PostFeedPage from "@/features/feed/pages/post-feed-page";
import PostDetailPage from "@/features/feed/pages/post-detail-page";
import ProfilePage from "@/features/profile/pages/profile-page";
import SavedPage from "@/features/saved/pages/saved-page";
import NotificationsPage from "@/features/notifications/pages/notifications-page";
import LoginPage from "@/features/auth/pages/login-page";
import RegisterPage from "@/features/auth/pages/register-page";

const router = createBrowserRouter([
  {
    path: "/",
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
    path: "/profile",
    element: (
      <MainLayout>
        <ProfilePage />
      </MainLayout>
    ),
  },
  {
    path: "/users/:username",
    element: (
      <MainLayout>
        <ProfilePage />
      </MainLayout>
    ),
  },
  {
    path: "/saved",
    element: (
      <MainLayout>
        <SavedPage />
      </MainLayout>
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
    path: "/notifications",
    element: (
      <MainLayout>
        <NotificationsPage />
      </MainLayout>
    ),
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
]);

export default router;
