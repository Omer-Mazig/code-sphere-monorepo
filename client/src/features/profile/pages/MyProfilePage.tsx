import { Outlet, Navigate, useLocation, Link } from "react-router-dom";
import ProfileHeader from "../components/ProfileHeader";
import ProfileTabs from "../components/ProfileTabs";

const MyProfilePage = () => {
  const location = useLocation();

  // Dummy data based on user.entity.ts
  const userData = {
    id: "123",
    firstName: "John",
    lastName: "Doe",
    username: "johndoe",
    email: "john@example.com",
    profileImageUrl: "https://github.com/shadcn.png",
    isActive: true,
    posts: [
      {
        id: "1",
        title: "First Post",
        content: "This is my first post",
        createdAt: new Date(),
        likes: 12,
      },
      {
        id: "2",
        title: "Second Post",
        content: "Another post I made",
        createdAt: new Date(),
        likes: 5,
      },
    ],
    likedPosts: [
      {
        id: "101",
        title: "Amazing Tech News",
        content: "The latest in tech innovation...",
        author: {
          id: "a1",
          username: "techguru",
          profileImageUrl: "https://github.com/shadcn.png",
        },
        createdAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
        likes: 42,
      },
      {
        id: "102",
        title: "Programming Tips",
        content: "Here are some great programming tips...",
        author: {
          id: "a2",
          username: "codemaster",
          profileImageUrl: "https://github.com/shadcn.png",
        },
        createdAt: new Date(Date.now() - 86400000 * 5), // 5 days ago
        likes: 29,
      },
      {
        id: "103",
        title: "Design Principles",
        content: "Essential design principles everyone should know...",
        author: {
          id: "a3",
          username: "designpro",
          profileImageUrl: "https://github.com/shadcn.png",
        },
        createdAt: new Date(Date.now() - 86400000 * 7), // 7 days ago
        likes: 64,
      },
    ],
    comments: [
      {
        id: "c1",
        content: "This is really insightful, thanks for sharing!",
        post: {
          id: "p1",
          title: "The Future of AI",
          author: {
            id: "a4",
            username: "aienthusiast",
            profileImageUrl: "https://github.com/shadcn.png",
          },
        },
        createdAt: new Date(Date.now() - 86400000 * 1), // 1 day ago
      },
      {
        id: "c2",
        content: "I disagree with point #3, here's why...",
        post: {
          id: "p2",
          title: "Controversial Tech Opinions",
          author: {
            id: "a5",
            username: "techdebater",
            profileImageUrl: "https://github.com/shadcn.png",
          },
        },
        createdAt: new Date(Date.now() - 86400000 * 3), // 3 days ago
      },
      {
        id: "c3",
        content: "Great explanation, this helped me a lot!",
        post: {
          id: "p3",
          title: "Understanding React Hooks",
          author: {
            id: "a6",
            username: "reactdev",
            profileImageUrl: "https://github.com/shadcn.png",
          },
        },
        createdAt: new Date(Date.now() - 86400000 * 6), // 6 days ago
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
    ],
    following: [
      {
        id: "201",
        username: "user3",
        profileImageUrl: "https://github.com/shadcn.png",
      },
      {
        id: "202",
        username: "user4",
        profileImageUrl: "https://github.com/shadcn.png",
      },
      {
        id: "203",
        username: "user5",
        profileImageUrl: "https://github.com/shadcn.png",
      },
    ],
    createdAt: new Date("2023-01-01"),
  };

  // If we're at the root path, redirect to the posts tab
  if (location.pathname === "/me/profile") {
    return (
      <Navigate
        to="/me/profile/posts"
        replace
      />
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <ProfileHeader
        userData={userData}
        isOwnProfile={true}
      />

      <ProfileTabs
        baseUrl="/me/profile"
        isOwnProfile={true}
      />

      <Outlet context={{ userData, isOwnProfile: true }} />
    </div>
  );
};

export default MyProfilePage;
