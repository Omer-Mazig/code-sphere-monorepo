import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/components/layout/main-layout";
import FeedPage from "@/features/feed/feed-page";
import PostDetailPage from "@/features/blog/post-detail-page";
import ProfilePage from "@/features/profile/profile-page";
import SavedPage from "@/features/saved/saved-page";
import NotificationsPage from "@/features/notifications/notifications-page";
import LoginPage from "@/features/auth/login-page";
import RegisterPage from "@/features/auth/register-page";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <MainLayout>
        <FeedPage />
      </MainLayout>
    ),
  },
  {
    path: "/feed/:filter",
    element: (
      <MainLayout>
        <FeedPage />
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
        <FeedPage />
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
