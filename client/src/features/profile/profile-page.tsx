import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { users, posts } from "@/lib/mock-data";
import { User, Post } from "@/types";
import { Edit, MapPin, Calendar, Link as LinkIcon } from "lucide-react";
import { Link } from "react-router-dom";
import ProfileTabs from "./profile-tabs";
import PostCard from "../feed/post-card";

const ProfilePage = () => {
  const { username } = useParams<{ username?: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  useEffect(() => {
    // In a real app, we would fetch the user data from the API
    // For now, we'll use mock data
    let targetUser: User;

    if (username) {
      // Find the user by username
      const foundUser = users.find(
        (u) => u.username.toLowerCase() === username.toLowerCase()
      );
      if (foundUser) {
        targetUser = foundUser;
        setIsCurrentUser(false); // Viewing someone else's profile
      } else {
        // User not found, fallback to current user
        targetUser = users[0];
        setIsCurrentUser(true);
      }
    } else {
      // No username in URL, show current user's profile
      targetUser = users[0];
      setIsCurrentUser(true);
    }

    setUser(targetUser);

    // Filter posts by the user
    setUserPosts(posts.filter((post) => post.authorId === targetUser.id));
  }, [username]);

  if (!user) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      {/* Cover Image */}
      <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg relative">
        {user.coverImageUrl && (
          <img
            src={user.coverImageUrl}
            alt="Cover"
            className="w-full h-full object-cover rounded-t-lg"
          />
        )}
      </div>

      {/* Profile Header */}
      <div className="bg-card rounded-b-lg shadow-sm p-6 mb-6 relative">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0 -mt-16">
            <img
              src={user.avatarUrl}
              alt={user.username}
              className="w-24 h-24 rounded-full border-4 border-background"
            />
          </div>

          {/* User Info */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">{user.displayName}</h1>
                <p className="text-muted-foreground">@{user.username}</p>
              </div>

              {isCurrentUser && (
                <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 self-start">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </button>
              )}

              {!isCurrentUser && (
                <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 self-start">
                  Follow
                </button>
              )}
            </div>

            <p className="mt-4">{user.bio}</p>

            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm text-muted-foreground">
              {user.location && (
                <div className="flex items-center">
                  <MapPin className="mr-1 h-4 w-4" />
                  {user.location}
                </div>
              )}

              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                Joined{" "}
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </div>

              {user.website && (
                <div className="flex items-center">
                  <LinkIcon className="mr-1 h-4 w-4" />
                  <Link
                    to={user.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {user.website.replace(/^https?:\/\//, "")}
                  </Link>
                </div>
              )}
            </div>

            <div className="flex gap-6 mt-4">
              <div>
                <span className="font-medium">{user.followersCount}</span>
                <span className="text-muted-foreground ml-1">Followers</span>
              </div>
              <div>
                <span className="font-medium">{user.followingCount}</span>
                <span className="text-muted-foreground ml-1">Following</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Tabs */}
      <ProfileTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        postsCount={userPosts.length}
        likesCount={user.likedPosts?.length || 0}
        aboutText={user.bio || ""}
      />

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "posts" && (
          <div className="space-y-6">
            {userPosts.length > 0 ? (
              userPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                />
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No posts yet
              </div>
            )}
          </div>
        )}

        {activeTab === "likes" && (
          <div className="text-center py-12 text-muted-foreground">
            Liked posts will appear here
          </div>
        )}

        {activeTab === "about" && (
          <div className="bg-card rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">About</h2>
            <p>{user.bio || "No bio provided"}</p>

            {user.skills && user.skills.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-muted rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
