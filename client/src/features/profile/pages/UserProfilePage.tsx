import { useState } from "react";
import { useParams, Outlet, Navigate, useLocation } from "react-router-dom";
import ProfileHeader from "../components/ProfileHeader";
import ProfileTabs from "../components/ProfileTabs";

const UserProfilePage = () => {
  const { userId } = useParams();
  const location = useLocation();
  const [isFollowing, setIsFollowing] = useState(false);

  // Dummy data based on user.entity.ts structure
  const userData = {
    id: userId || "456",
    firstName: "Jane",
    lastName: "Smith",
    username: "janesmith",
    email: "jane@example.com",
    profileImageUrl: "https://github.com/shadcn.png",
    isActive: true,
    posts: [
      {
        id: "1",
        title: "Hello World",
        content: "This is my hello world post",
        createdAt: new Date(),
        likes: 25,
      },
      {
        id: "2",
        title: "My Journey",
        content: "This is my journey so far",
        createdAt: new Date(),
        likes: 18,
      },
      {
        id: "3",
        title: "Latest Update",
        content: "Here's what I've been working on",
        createdAt: new Date(),
        likes: 7,
      },
    ],
    likedPosts: [
      {
        id: "101",
        title: "Web Development Trends 2023",
        content: "The top trends in web development this year...",
        author: {
          id: "a1",
          username: "webdev",
          profileImageUrl: "https://github.com/shadcn.png",
        },
        createdAt: new Date(Date.now() - 86400000 * 3), // 3 days ago
        likes: 89,
      },
      {
        id: "102",
        title: "TypeScript Best Practices",
        content:
          "Follow these TypeScript best practices to write cleaner code...",
        author: {
          id: "a2",
          username: "tsexpert",
          profileImageUrl: "https://github.com/shadcn.png",
        },
        createdAt: new Date(Date.now() - 86400000 * 7), // 7 days ago
        likes: 124,
      },
    ],
    comments: [
      {
        id: "c1",
        content: "I've been using this approach and it works great!",
        post: {
          id: "p1",
          title: "Modern CSS Techniques",
          author: {
            id: "a3",
            username: "cssmaster",
            profileImageUrl: "https://github.com/shadcn.png",
          },
        },
        createdAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
      },
      {
        id: "c2",
        content: "Have you considered using GraphQL for this?",
        post: {
          id: "p2",
          title: "Building API Architecture",
          author: {
            id: "a4",
            username: "apidesigner",
            profileImageUrl: "https://github.com/shadcn.png",
          },
        },
        createdAt: new Date(Date.now() - 86400000 * 4), // 4 days ago
      },
      {
        id: "c3",
        content: "This was really helpful, thanks for sharing your knowledge!",
        post: {
          id: "p3",
          title: "Understanding Docker Compose",
          author: {
            id: "a5",
            username: "devopsguru",
            profileImageUrl: "https://github.com/shadcn.png",
          },
        },
        createdAt: new Date(Date.now() - 86400000 * 9), // 9 days ago
      },
    ],
    followers: [
      {
        id: "101",
        username: "user1",
        profileImageUrl: "https://github.com/shadcn.png",
      },
      {
        id: "102",
        username: "user2",
        profileImageUrl: "https://github.com/shadcn.png",
      },
      {
        id: "103",
        username: "user3",
        profileImageUrl: "https://github.com/shadcn.png",
      },
      {
        id: "104",
        username: "user4",
        profileImageUrl: "https://github.com/shadcn.png",
      },
    ],
    following: [
      {
        id: "201",
        username: "user5",
        profileImageUrl: "https://github.com/shadcn.png",
      },
      {
        id: "202",
        username: "user6",
        profileImageUrl: "https://github.com/shadcn.png",
      },
    ],
    createdAt: new Date("2022-05-15"),
  };

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
  };

  // If we're at the root path, redirect to the posts tab
  if (location.pathname === `/profile/${userId}`) {
    return (
      <Navigate
        to={`/profile/${userId}/posts`}
        replace
      />
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <ProfileHeader
        userData={userData}
        isOwnProfile={false}
        isFollowing={isFollowing}
        onFollowToggle={handleFollowToggle}
      />

      <ProfileTabs
        baseUrl={`/profile/${userId}`}
        isOwnProfile={false}
      />

      <Outlet context={{ userData, isOwnProfile: false }} />
    </div>
  );
};

export default UserProfilePage;
