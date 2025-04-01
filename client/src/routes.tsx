import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "@/components/layout/main-layout";
import PostFeedPage from "@/features/feed/pages/post-feed-page";
import PostDetailPage from "@/features/feed/pages/post-detail-page";
import NewPostPage from "@/features/feed/pages/new-post-page";

import LoginPage from "@/features/auth/pages/login-page";
import RegisterPage from "@/features/auth/pages/register-page";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { UnauthenticatedRoute } from "@/components/auth/unauthenticated-route";
import EditPostPage from "@/features/feed/pages/edit-post-page";
import MyProfilePage from "@/features/profile/pages/MyProfilePage";
import UserProfilePage from "@/features/profile/pages/UserProfilePage";
import {
  ProfilePostsTab,
  ProfileLikedPostsTab,
  ProfileCommentsTab,
  ProfileFollowersTab,
  ProfileFollowingTab,
} from "@/features/profile/pages/ProfileTabContent";

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
    path: "/posts/:id/edit",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <EditPostPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile/:userId",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <UserProfilePage />
        </MainLayout>
      </ProtectedRoute>
    ),
    children: [
      {
        path: "posts",
        element: <ProfilePostsTab />,
      },
      {
        path: "liked",
        element: <ProfileLikedPostsTab />,
      },
      {
        path: "comments",
        element: <ProfileCommentsTab />,
      },
      {
        path: "followers",
        element: <ProfileFollowersTab />,
      },
      {
        path: "following",
        element: <ProfileFollowingTab />,
      },
    ],
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
    children: [
      {
        path: "posts",
        element: <ProfilePostsTab />,
      },
      {
        path: "liked",
        element: <ProfileLikedPostsTab />,
      },
      {
        path: "comments",
        element: <ProfileCommentsTab />,
      },
      {
        path: "followers",
        element: <ProfileFollowersTab />,
      },
      {
        path: "following",
        element: <ProfileFollowingTab />,
      },
    ],
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
